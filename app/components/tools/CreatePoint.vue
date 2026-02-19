<script setup>
  import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json"
  import { importItem } from "@ogw_front/utils/file_import_workflow"
  import { useGeodeStore } from "@ogw_front/stores/geode"
  import { useUIStore } from "@vease/stores/UI"

  const UIStore = useUIStore()
  const geodeStore = useGeodeStore()

  const MIN_COORDINATES = 3

  function openCreateTools() {
    UIStore.setSelectedTool(null)
    UIStore.setShowCreateTools(true)
    UIStore.setShowCreatePoint(false)
    UIStore.setShowCreateAOI(false)
  }

  const name = ref("")
  const x = ref("")
  const y = ref("")
  const z = ref("")

  const loading = ref(false)

  const isFormFilled = computed(
    () =>
      name.value !== "" && x.value !== "" && y.value !== "" && z.value !== "",
  )

  function closeDrawer() {
    UIStore.setShowCreateTools(false)
  }

  function safeParseFloat(value) {
    const sanitizedValue = String(value).trim().replaceAll(",", ".")
    const result = Number.parseFloat(sanitizedValue)
    return Number.isNaN(result) && sanitizedValue === "" ? Number.NaN : result
  }

  async function createPoint() {
    if (!isFormFilled.value) return

    const pointData = {
      x: safeParseFloat(x.value),
      y: safeParseFloat(y.value),
      z: safeParseFloat(z.value),
      name: name.value,
    }

    const pointSchema = back_schemas.opengeodeweb_back.create.point

    if (!pointSchema || typeof pointSchema !== "object") {
      console.error(
        "FATAL ERROR: The Point schema is missing or invalid at back_schemas.opengeodeweb_back.create.point",
      )
      loading.value = false
      return
    }

    loading.value = true
    try {
      await geodeStore.request(pointSchema, pointData, {
        response_function: async (response) => {
          const dataToImport = {
            ...response,
          }
          await importItem(dataToImport)
          closeDrawer()
        },
      })
    } finally {
      loading.value = false
    }
  }

  function sanitizeNumberString(str) {
    if (str === undefined || str === null) return ""
    let value = String(str)
      .replace(/,/g, ".")
      .replace(/[^0-9eE+\-.]/g, "")
    if (/[eE]/.test(value)) {
      const parts = value.split(/[eE]/)
      if (parts.length > 2) {
        value =
          parts.slice(0, 2).join("e") +
          parts
            .slice(2)
            .join("")
            .replace(/[^0-9+\-.]/g, "")
      }
    }
    return value
  }

  function assignSanitizedCoordinates(sanitized) {
    if (sanitized.length >= MIN_COORDINATES) {
      const [sanitizedX, sanitizedY, sanitizedZ] = sanitized
      x.value = sanitizedX
      y.value = sanitizedY
      z.value = sanitizedZ
      return true
    } else if (sanitized.length === 2) {
      const [sanitizedX, sanitizedY] = sanitized
      x.value = sanitizedX
      y.value = sanitizedY
      z.value = "0"
      return true
    }
    return false
  }

  function handlePaste(event, field) {
    const pastedText =
      (event && event.clipboardData && event.clipboardData.getData("text")) ||
      ""

    if (!pastedText) return

    const coordinates = pastedText.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g)
    if (!coordinates || coordinates.length === 0) return

    const sanitized = coordinates.map((coord) => sanitizeNumberString(coord))

    if (assignSanitizedCoordinates(sanitized)) {
      event.preventDefault()
    } else if (sanitized.length === 1) {
      const [firstSanitized] = sanitized
      if (field === "x") x.value = firstSanitized
      else if (field === "y") y.value = firstSanitized
      else if (field === "z") z.value = firstSanitized
      else return
      event.preventDefault()
    }
  }

  function sanitizeInput(value, label) {
    if (label === "x") x.value = sanitizeNumberString(value)
    else if (label === "y") y.value = sanitizeNumberString(value)
    else if (label === "z") z.value = sanitizeNumberString(value)
    else if (label === "name") name.value = value
  }
</script>

<template>
  <v-card flat color="transparent" class="pa-0" theme="dark">
    <v-card-title
      class="pb-2 text-h5 font-weight-bold d-flex align-center text-white"
    >
      <v-icon
        icon="mdi-circle-medium"
        class="mr-3 text-h4"
        color="secondary"
      ></v-icon>
      Create Specific Point
    </v-card-title>

    <v-card-subtitle class="ma-0 text-white opacity-80">
      Enter the coordinates and a title for your new point object.
    </v-card-subtitle>

    <v-card-text class="pt-6">
      <v-form ref="form" class="mt-4">
        <v-text-field
          v-model="name"
          type="text"
          variant="outlined"
          color="white"
          :rules="[(v) => !!v || 'Name is required']"
          required
          theme="dark"
          base-color="white"
          bg-color="rgba(255, 255, 255, 0.15)"
          class="mb-4 rounded-lg"
        >
          <template v-slot:label>
            <span class="text-white opacity-100">Object Name</span>
          </template>
          <template v-slot:prepend-inner>
            <v-icon color="white" class="opacity-100">mdi-format-title</v-icon>
          </template>
        </v-text-field>

        <v-row dense>
          <v-col cols="4">
            <v-text-field
              v-model="x"
              type="text"
              inputmode="decimal"
              variant="outlined"
              color="white"
              density="comfortable"
              :rules="[(v) => !!v || 'X is required']"
              @paste="handlePaste($event, 'x')"
              @update:modelValue="(val) => sanitizeInput(val, 'x')"
              class="rounded-lg"
              theme="dark"
              base-color="white"
              bg-color="rgba(255, 255, 255, 0.15)"
            >
              <template v-slot:label>
                <span class="text-white opacity-100">X</span>
              </template>
              <template v-slot:prepend-inner>
                <v-icon color="white" class="opacity-100"
                  >mdi-axis-x-arrow</v-icon
                >
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="y"
              type="text"
              inputmode="decimal"
              variant="outlined"
              color="white"
              density="comfortable"
              :rules="[(v) => !!v || 'Y is required']"
              @paste="handlePaste($event, 'y')"
              @update:modelValue="(val) => sanitizeInput(val, 'y')"
              class="rounded-lg"
              theme="dark"
              base-color="white"
              bg-color="rgba(255, 255, 255, 0.15)"
            >
              <template v-slot:label>
                <span class="text-white opacity-100">Y</span>
              </template>
              <template v-slot:prepend-inner>
                <v-icon color="white" class="opacity-100"
                  >mdi-axis-y-arrow</v-icon
                >
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="z"
              type="text"
              inputmode="decimal"
              variant="outlined"
              color="white"
              density="comfortable"
              :rules="[(v) => !!v || 'Z is required']"
              @paste="handlePaste($event, 'z')"
              @update:modelValue="(val) => sanitizeInput(val, 'z')"
              class="rounded-lg"
              theme="dark"
              base-color="white"
              bg-color="rgba(255, 255, 255, 0.15)"
            >
              <template v-slot:label>
                <span class="text-white opacity-100">Z</span>
              </template>
              <template v-slot:prepend-inner>
                <v-icon color="white" class="opacity-100"
                  >mdi-axis-z-arrow</v-icon
                >
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="px-0 pb-0 mt-4">
      <v-btn
        variant="text"
        color="white"
        size="large"
        @click="openCreateTools"
        :disabled="loading"
        class="text-none rounded-lg"
      >
        <v-icon start>mdi-close-circle-outline</v-icon>
        Cancel
      </v-btn>

      <v-spacer />

      <v-btn
        color="primary"
        size="large"
        variant="flat"
        :loading="loading"
        :disabled="!isFormFilled"
        @click="createPoint"
        class="text-none rounded-lg font-weight-bold"
        elevation="4"
      >
        <v-icon start>mdi-send</v-icon>
        Create Point
        <template #loader>
          <v-progress-circular
            indeterminate
            size="20"
            color="white"
            width="3"
          />
        </template>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
