<template>
  <v-card :width="500" elevation="0" class="pa-4">
    <v-card-title
      class="pb-2 text-h6 text-primary font-weight-bold d-flex align-center"
    >
      <v-img
        src="/aoi.svg"
        alt="AOI icon"
        class="mr-3"
        width="48"
        height="48"
      />
      Create Area of Interest (Bounding Box)
    </v-card-title>

    <v-card-subtitle class="ma-0 text-medium-emphasis text-wrap">
      Enter the name and Min/Max coordinates to define your rectangular AOI.
    </v-card-subtitle>

    <v-card-text>
      <v-form ref="form">
        <v-text-field
          label="AOI Name"
          v-model="name"
          prepend-inner-icon="mdi-format-title"
          type="text"
          variant="outlined"
          color="primary"
          :rules="[(v) => !!v || 'Name is required']"
          required
          class="mb-4"
        />

        <div class="mb-4">
          <p class="text-subtitle-1 font-weight-medium mb-2">
            Minimum Coordinates (Min X, Min Y)
          </p>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                label="Min X"
                v-model="min_x"
                prepend-inner-icon="mdi-axis-x-arrow"
                type="text"
                inputmode="decimal"
                variant="outlined"
                color="secondary"
                density="comfortable"
                :rules="[(v) => !!v || 'Min X is required']"
                @paste="handlePasteAOI($event, 'min', 'x')"
                @update:modelValue="(val) => sanitizeInputAOI(val, 'min_x')"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Min Y"
                v-model="min_y"
                prepend-inner-icon="mdi-axis-y-arrow"
                type="text"
                inputmode="decimal"
                variant="outlined"
                color="secondary"
                density="comfortable"
                :rules="[(v) => !!v || 'Min Y is required']"
                @paste="handlePasteAOI($event, 'min', 'y')"
                @update:modelValue="(val) => sanitizeInputAOI(val, 'min_y')"
              />
            </v-col>
          </v-row>
        </div>

        <div class="mb-4">
          <p class="text-subtitle-1 font-weight-medium mb-2">
            Maximum Coordinates (Max X, Max Y)
          </p>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                label="Max X"
                v-model="max_x"
                prepend-inner-icon="mdi-axis-x-arrow"
                type="text"
                inputmode="decimal"
                variant="outlined"
                color="secondary"
                density="comfortable"
                :rules="[(v) => !!v || 'Max X is required']"
                @paste="handlePasteAOI($event, 'max', 'x')"
                @update:modelValue="(val) => sanitizeInputAOI(val, 'max_x')"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Max Y"
                v-model="max_y"
                prepend-inner-icon="mdi-axis-y-arrow"
                type="text"
                inputmode="decimal"
                variant="outlined"
                color="secondary"
                density="comfortable"
                :rules="[(v) => !!v || 'Max Y is required']"
                @paste="handlePasteAOI($event, 'max', 'y')"
                @update:modelValue="(val) => sanitizeInputAOI(val, 'max_y')"
              />
            </v-col>
          </v-row>
        </div>
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
        @click="createAOI"
        class="text-none ml-4"
      >
        <v-icon start class="ml-1">mdi-send</v-icon>
        Create AOI
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
  const hybridViewerStore = useHybridViewerStore()

  const name = ref("")
  const min_x = ref("")
  const min_y = ref("")
  const max_x = ref("")
  const max_y = ref("")
  const z = ref("")

  const loading = ref(false)

  const isFormFilled = computed(() => {
    const coordsFilled =
      min_x.value !== "" &&
      min_y.value !== "" &&
      max_x.value !== "" &&
      max_y.value !== ""
    return name.value !== "" && coordsFilled
  })

  const closeDrawer = () => {
    UIStore.setShowCreateAOI(false)
  }

  const safeParseFloat = (value) => {
    const sanitizedValue = String(value).trim().replace(",", ".")
    const result = parseFloat(sanitizedValue)
    return isNaN(result) && sanitizedValue === "" ? NaN : result
  }

  function visibleBoundingBox() {
    if (!hybridViewerStore.genericRenderWindow.value)
      return [-1, 1, -1, 1, -1, 1]
    const renderer = hybridViewerStore.genericRenderWindow.value.getRenderer()
    return renderer.computeVisiblePropBounds()
  }

  const initializeAOICoordinates = () => {
    const bounds = visibleBoundingBox()
    const boundsMinX = bounds[0]
    const boundsMaxX = bounds[1]
    const boundsMinY = bounds[2]
    const boundsMaxY = bounds[3]

    const extentX = boundsMaxX - boundsMinX
    const extentY = boundsMaxY - boundsMinY

    const paddingX = extentX * 0.1
    const paddingY = extentY * 0.1

    const newMinX = boundsMinX - paddingX
    const newMaxX = boundsMaxX + paddingX
    const newMinY = boundsMinY - paddingY
    const newMaxY = boundsMaxY + paddingY

    min_x.value = newMinX
    max_x.value = newMaxX
    min_y.value = newMinY
    max_y.value = newMaxY
    z.value = (bounds[4] + bounds[5]) / 2
  }

  onMounted(() => {
    initializeAOICoordinates()
  })

  watch(
    () => UIStore.showCreateAOI,
    (newVal) => {
      if (newVal) {
        initializeAOICoordinates()
      }
    },
  )

  async function registerObject(data) {
    await viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.generic.register,
        params: {
          id: data.id,
        },
      },
      {
        response_function: async () => {
          const min_x_val = safeParseFloat(min_x.value)
          const min_y_val = safeParseFloat(min_y.value)
          const max_x_val = safeParseFloat(max_x.value)
          const max_y_val = safeParseFloat(max_y.value)
          const z_val = safeParseFloat(z.value)

          const aoiPoints = [
            { x: min_x_val, y: min_y_val },
            { x: max_x_val, y: min_y_val },
            { x: max_x_val, y: max_y_val },
            { x: min_x_val, y: max_y_val },
          ]

          const itemToAdd = {
            object_type: data.object_type,
            geode_object: data.geode_object,
            native_filename: data.native_file_name,
            viewable_filename: data.viewable_file_name,
            displayed_name: data.name,
            geode_object_data: {
              points: aoiPoints,
              z: z_val,
            },
            vtk_js: {
              binary_light_viewable: data.binary_light_viewable,
            },
          }

          await dataBaseStore.addItem(data.id, itemToAdd)

          closeDrawer()
        },
      },
    )
  }
  async function createAOI() {
    const min_x_val = safeParseFloat(min_x.value)
    const min_y_val = safeParseFloat(min_y.value)
    const max_x_val = safeParseFloat(max_x.value)
    const max_y_val = safeParseFloat(max_y.value)
    const z_val = safeParseFloat(z.value)

    const hasNaN =
      isNaN(min_x_val) ||
      isNaN(min_y_val) ||
      isNaN(max_x_val) ||
      isNaN(max_y_val) ||
      isNaN(z_val)

    if (hasNaN) {
      loading.value = false
      return
    }

    if (min_x_val >= max_x_val || min_y_val >= max_y_val) {
      loading.value = false
      return
    }

    const aoiPoints = [
      { x: min_x_val, y: min_y_val },
      { x: max_x_val, y: min_y_val },
      { x: max_x_val, y: max_y_val },
      { x: min_x_val, y: max_y_val },
    ]

    const aoiData = {
      name: name.value,
      points: aoiPoints,
      z: z_val,
    }

    const aoiSchema = back_schemas.opengeodeweb_back.create.create_aoi

    if (!aoiSchema || typeof aoiSchema !== "object") {
      loading.value = false
      return
    }
    loading.value = true
    try {
      await api_fetch(
        {
          schema: aoiSchema,
          params: aoiData,
        },
        {
          response_function: async (response) => {
            await registerObject(response._data)
          },
        },
      )
    } catch (error) {
    } finally {
      loading.value = false
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

  const handlePasteAOI = (event, type, field) => {
    const pastedText =
      (event && event.clipboardData && event.clipboardData.getData("text")) ||
      ""

    if (!pastedText) return

    const coordinates = pastedText.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g)
    if (!coordinates || coordinates.length === 0) return

    const sanitized = coordinates.map((c) => sanitizeNumberString(c))

    if (sanitized.length >= 2) {
      if (field === "x" || type === "min") {
        min_x.value = sanitized[0]
      } else {
        max_x.value = sanitized[0]
      }
      if (field === "y" || type === "min") {
        min_y.value = sanitized[1]
      } else {
        max_y.value = sanitized[1]
      }
      event.preventDefault()
    } else if (sanitized.length === 1) {
      if (field === "x") {
        if (type === "min") {
          min_x.value = sanitized[0]
        } else {
          max_x.value = sanitized[0]
        }
      } else {
        if (type === "min") {
          min_y.value = sanitized[0]
        } else {
          max_y.value = sanitized[0]
        }
      }
      event.preventDefault()
    }
  }

  const sanitizeInputAOI = (value, field) => {
    if (field === "min_x") min_x.value = sanitizeNumberString(value)
    else if (field === "min_y") min_y.value = sanitizeNumberString(value)
    else if (field === "max_x") max_x.value = sanitizeNumberString(value)
    else if (field === "max_y") max_y.value = sanitizeNumberString(value)
  }
</script>
