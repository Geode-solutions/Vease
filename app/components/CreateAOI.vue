<template>
  <v-card :width="500" elevation="10" rounded="xl" class="pa-4">
    <v-card-title class="pb-2">
      <h2 class="text-h5 text-primary font-weight-bold d-flex align-center">
        <img
          src="/aoi.svg"
          alt="AOI icon"
          class="mr-3"
          width="48"
          height="48"
          color="grey-darken-2"
        />
        Create Area ofInterest
      </h2>
    </v-card-title>

    <v-card-subtitle>
      <p class="ma-0 text-medium-emphasis">
        Enter the title and coordinates to define your AOI.
      </p>
    </v-card-subtitle>

    <v-card-text>
      <v-form ref="form">
        <v-text-field
          label="AOI Title"
          v-model="aoi.title"
          prepend-inner-icon="mdi-format-title"
          type="text"
          variant="outlined"
          color="primary"
          :rules="[(v) => !!v || 'Title is required']"
          required
          class="mb-4"
        />

        <div class="mb-4">
          <p class="text-subtitle-1 font-weight-medium mb-2">
            Boundary Points (X, Y)
          </p>
          <v-row v-for="(p, index) in aoi.points" :key="index" dense>
            <v-col cols="6">
              <v-text-field
                :label="`Point ${index + 1} - X`"
                v-model="p.x"
                prepend-inner-icon="mdi-axis-x-arrow"
                type="text"
                inputmode="decimal"
                variant="outlined"
                color="secondary"
                density="comfortable"
                :rules="[(v) => !!v || 'X is required']"
                @paste="handlePasteAOI($event, index, 'x')"
                @update:modelValue="(val) => sanitizeInputAOI(val, index, 'x')"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                :label="`Point ${index + 1} - Y`"
                v-model="p.y"
                prepend-inner-icon="mdi-axis-y-arrow"
                type="text"
                inputmode="decimal"
                variant="outlined"
                color="secondary"
                density="comfortable"
                :rules="[(v) => !!v || 'Y is required']"
                @paste="handlePasteAOI($event, index, 'y')"
                @update:modelValue="(val) => sanitizeInputAOI(val, index, 'y')"
              />
            </v-col>
          </v-row>
        </div>

        <v-text-field
          label="Z (Common for all points)"
          v-model="aoi.z"
          prepend-inner-icon="mdi-axis-z-arrow"
          type="text"
          inputmode="decimal"
          variant="outlined"
          color="secondary"
          :rules="[(v) => !!v || 'Z is required']"
          @paste="handlePasteZAOI($event, 'z')"
          @update:modelValue="(val) => sanitizeInputZAOI(val, 'z')"
        />
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
        <v-icon start>mdi-send</v-icon>
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

  const aoi = ref({
    title: "",
    points: [
      { x: "", y: "" },
      { x: "", y: "" },
      { x: "", y: "" },
      { x: "", y: "" },
    ],
    z: "",
  })

  const loading = ref(false)

  const isFormFilled = computed(() => {
    const allPointsFilled = aoi.value.points.every(
      (p) => p.x !== "" && p.y !== ""
    )
    return aoi.value.title !== "" && allPointsFilled && aoi.value.z !== ""
  })

  const closeDrawer = () => {
    UIStore.setShowCreateAOI(false)
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

  async function createAOI() {
    const aoiData = {
      name: aoi.value.title,
      points: aoi.value.points.map((p) => ({
        x: safeParseFloat(p.x),
        y: safeParseFloat(p.y),
      })),
      z: safeParseFloat(aoi.value.z),
    }

    const aoiSchema = back_schemas.opengeodeweb_back.create.create_aoi

    if (!aoiSchema || typeof aoiSchema !== "object") {
      console.error(
        "FATAL ERROR: The AOI schema is missing or invalid at back_schemas.opengeodeweb_back.create.create_aoi"
      )
      loading.value = false
      return
    }

    const hasNaN =
      aoiData.points.some((p) => isNaN(p.x) || isNaN(p.y)) || isNaN(aoiData.z)

    if (hasNaN) {
      console.error(
        "AOI creation failed: One or more coordinate values resulted in NaN after parsing. Check the input format."
      )
      loading.value = false
      return
    }

    if (validate_schema(aoiSchema, aoiData)) {
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
          }
        )
      } finally {
        loading.value = false
      }
    } else {
      console.error(
        "Schema validation FAILED for AOI. Check console for AJV errors."
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

  const handlePasteAOI = (event, index, field) => {
    const pastedText =
      (event && event.clipboardData && event.clipboardData.getData("text")) ||
      ""

    if (!pastedText) return

    const coordinates = pastedText.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g)
    if (!coordinates || coordinates.length === 0) return

    const sanitized = coordinates.map((c) => sanitizeNumberString(c))

    if (sanitized.length >= 2) {
      aoi.value.points[index].x = sanitized[0]
      aoi.value.points[index].y = sanitized[1]
      event.preventDefault()
    } else if (sanitized.length === 1) {
      aoi.value.points[index][field] = sanitized[0]
      event.preventDefault()
    }
  }

  const handlePasteZAOI = (event) => {
    const pastedText =
      (event && event.clipboardData && event.clipboardData.getData("text")) ||
      ""
    const coordinates = pastedText.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g)

    if (coordinates && coordinates.length > 0) {
      aoi.value.z = sanitizeNumberString(coordinates[0])
      event.preventDefault()
    }
  }

  const sanitizeInputAOI = (value, index, field) => {
    aoi.value.points[index][field] = sanitizeNumberString(value)
  }

  const sanitizeInputZAOI = (value) => {
    aoi.value.z = sanitizeNumberString(value)
  }
</script>
