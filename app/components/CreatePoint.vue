<template>
  <v-card :width="500" elevation="10" rounded="xl" class="pa-4">
    <v-card-title class="pb-2">
      <h2 class="text-h5 text-primary font-weight-bold d-flex align-center">
        <v-icon
          icon="mdi-circle-medium"
          class="mr-3 text-h4"
          color="grey-darken-2"
        ></v-icon>
        Create Precise Point
      </h2>
    </v-card-title>

    <v-card-subtitle>
      <p class="ma-0 text-medium-emphasis">
        Enter the coordinates and a title for your new point object.
      </p>
    </v-card-subtitle>

    <v-card-text>
      <v-form ref="form">
        <v-text-field
          label="Object Title"
          v-model="point.title"
          prepend-inner-icon="mdi-format-title"
          type="text"
          variant="outlined"
          color="primary"
          :rules="[(v) => !!v || 'Title is required']"
          required
          class="mb-4"
        />

        <v-row dense>
          <v-col cols="4">
            <v-text-field
              label="X Coordinate"
              v-model="point.x"
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
              v-model="point.y"
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
              v-model="point.z"
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
<script setup>
  import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json"
  import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json"
  const openCreateTools = () => {
    UIStore.setShowCreateTools(true)
    UIStore.setShowCreatePoint(false)
    UIStore.setShowCreateAOI(false)
  }

  const UIStore = useUIStore()
  const dataBaseStore = useDataBaseStore()

  const point = ref({
    title: "",
    x: "",
    y: "",
    z: "",
  })

  const loading = ref(false)

  const isFormFilled = computed(() => {
    return (
      point.value.title !== "" &&
      point.value.x !== "" &&
      point.value.y !== "" &&
      point.value.z !== ""
    )
  })

  const closeDrawer = () => {
    UIStore.setShowCreatePoint(false)
  }

  const safeParseFloat = (value) => {
    const sanitizedValue = String(value).trim().replace(",", ".")
    const result = parseFloat(sanitizedValue)
    return isNaN(result) && sanitizedValue === "" ? NaN : result
  }

  async function registerObject(data) {
    await viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.generic.register,
        params: {
          id: data.id,
          file_name: data.viewable_file_name,
          viewer_object: data.object_type,
        },
      },
      {
        response_function: async () => {
          await dataBaseStore.addItem(data.id, {
            object_type: data.object_type,
            geode_object: data.geode_object,
            native_filename: data.native_file_name,
            viewable_filename: data.viewable_file_name,
            name: data.name,
          })
          closeDrawer()
        },
      }
    )
  }

  async function createPoint() {
    if (!isFormFilled.value) return

    const pointData = {
      x: safeParseFloat(point.value.x),
      y: safeParseFloat(point.value.y),
      z: safeParseFloat(point.value.z),
      name: point.value.title,
    }

    const pointSchema = back_schemas.opengeodeweb_back.create.create_point

    if (!pointSchema || typeof pointSchema !== "object") {
      console.error(
        "FATAL ERROR: The Point schema is missing or invalid at back_schemas.opengeodeweb_back.create.create_point"
      )
      loading.value = false
      return
    }

    if (validate_schema(pointSchema, pointData)) {
      loading.value = true
      try {
        await api_fetch(
          {
            schema: pointSchema,
            params: pointData,
          },
          {
            response_function: async (response) => {
              await registerObject(response._data)
            },
          }
        )
      } finally {
        loading.value = false
      }
    } else {
      console.error(
        "Schema validation FAILED for Point. Check console for AJV errors."
      )
    }
  }

  const sanitizeNumberString = (str) => {
    if (str == null) return ""
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

  const handlePaste = (event, field) => {
    const pastedText =
      (event && event.clipboardData && event.clipboardData.getData("text")) ||
      ""

    if (!pastedText) return

    const coordinates = pastedText.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g)
    if (!coordinates || coordinates.length === 0) return

    const sanitized = coordinates.map((c) => sanitizeNumberString(c))

    if (sanitized.length >= 3) {
      point.value.x = sanitized[0]
      point.value.y = sanitized[1]
      point.value.z = sanitized[2]
      event.preventDefault()
    } else if (sanitized.length === 2) {
      point.value.x = sanitized[0]
      point.value.y = sanitized[1]
      point.value.z = "0"
      event.preventDefault()
    } else if (sanitized.length === 1) {
      if (["x", "y", "z"].includes(field)) {
        point.value[field] = sanitized[0]
        event.preventDefault()
      }
    }
  }

  const sanitizeInput = (value, label) => {
    point.value[label] = sanitizeNumberString(value)
  }
</script>
