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
    if (!isFormFilled.value) {
      return
    }

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
    if (str === undefined || str === null) {
      return ""
    }
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

    if (!pastedText) {
      return
    }

    const coordinates = pastedText.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g)
    if (!coordinates || coordinates.length === 0) {
      return
    }

    const sanitized = coordinates.map((coord) => sanitizeNumberString(coord))

    if (assignSanitizedCoordinates(sanitized)) {
      event.preventDefault()
    } else if (sanitized.length === 1) {
      const [firstSanitized] = sanitized
      if (field === "x") {
        x.value = firstSanitized
      } else if (field === "y") {
        y.value = firstSanitized
      } else if (field === "z") {
        z.value = firstSanitized
      } else {
        return
      }
      event.preventDefault()
    }
  }

  function sanitizeInput(value, label) {
    if (label === "x") {
      x.value = sanitizeNumberString(value)
    } else if (label === "y") {
      y.value = sanitizeNumberString(value)
    } else if (label === "z") {
      z.value = sanitizeNumberString(value)
    } else if (label === "name") {
      name.value = value
    }
  }
</script>

<template>
  <v-card :width="500" elevation="0" class="pa-4">
    <v-card-title
      class="pb-2 text-h5 text-primary font-weight-bold d-flex align-center"
    >
      <v-icon
        icon="mdi-circle-medium"
        class="mr-3 text-h4"
        color="grey-darken-2"
      ></v-icon>
      Create Specific Point
    </v-card-title>

    <v-card-subtitle class="ma-0 text-medium-emphasis">
      Enter the coordinates and a title for your new point object.
    </v-card-subtitle>
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          label="Object Name"
          v-model="name"
          prepend-inner-icon="mdi-format-title"
          type="text"
          variant="outlined"
          color="primary"
          :rules="[(v) => !!v || 'Name is required']"
          required
          class="mb-4"
        />

        <v-row dense>
          <v-col cols="4">
            <v-text-field
              label="X Coordinate"
              v-model="x"
              prepend-inner-icon="mdi-axis-x-arrow"
              type="text"
              inputmode="decimal"
              variant="outlined"
              color="secondary"
              density="comfortable"
              :rules="[(v) => !!v || 'X is required']"
              @paste="handlePaste($event, 'x')"
              @update:modelValue="(val) => sanitizeInput(val, 'x')"
            />
          </v-col>

          <v-col cols="4">
            <v-text-field
              label="Y Coordinate"
              v-model="y"
              prepend-inner-icon="mdi-axis-y-arrow"
              type="text"
              inputmode="decimal"
              variant="outlined"
              color="secondary"
              density="comfortable"
              :rules="[(v) => !!v || 'Y is required']"
              @paste="handlePaste($event, 'y')"
              @update:modelValue="(val) => sanitizeInput(val, 'y')"
            />
          </v-col>

          <v-col cols="4">
            <v-text-field
              label="Z Coordinate"
              v-model="z"
              prepend-inner-icon="mdi-axis-z-arrow"
              type="text"
              inputmode="decimal"
              variant="outlined"
              color="secondary"
              density="comfortable"
              :rules="[(v) => !!v || 'Z is required']"
              @paste="handlePaste($event, 'z')"
              @update:modelValue="(val) => sanitizeInput(val, 'z')"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions class="px-4 pb-4">
      <v-btn
        variant="text"
        color="grey-darken-1"
        size="large"
        @click="openCreateTools"
        :disabled="loading"
        class="text-none"
      >
        <v-icon start>mdi-close-circle-outline</v-icon>
        Cancel
      </v-btn>

      <v-btn
        color="primary"
        size="large"
        variant="flat"
        :loading="loading"
        :disabled="!isFormFilled"
        @click="createPoint"
        class="text-none ml-4"
      >
        <v-icon start class="ml-1">mdi-send</v-icon>
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
