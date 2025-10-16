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
        Create Area of Interest (Bounding Box)
      </h2>
    </v-card-title>

    <v-card-subtitle>
      <p class="ma-0 text-medium-emphasis">
        Enter the title and Min/Max coordinates to define your rectangular AOI.
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
            Minimum Coordinates (Min X, Min Y)
          </p>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                label="Min X"
                v-model="aoi.min_x"
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
                v-model="aoi.min_y"
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
                v-model="aoi.max_x"
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
                v-model="aoi.max_y"
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

        <v-text-field
          label="Z (Common for all points)"
          v-model="aoi.z"
          prepend-inner-icon="mdi-axis-z-arrow"
          type="text"
          inputmode="decimal"
          variant="outlined"
          color="secondary"
          :rules="[(v) => !!v || 'Z is required']"
          @paste="handlePasteZAOI($event)"
          @update:modelValue="(val) => sanitizeInputZAOI(val)"
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

  // Structure d'état pour capturer les coordonnées Min/Max
  const aoi = ref({
    title: "",
    min_x: "",
    min_y: "",
    max_x: "",
    max_y: "",
    z: "",
  })

  const loading = ref(false)

  // Vérification que tous les champs sont remplis
  const isFormFilled = computed(() => {
    const coordsFilled =
      aoi.value.min_x !== "" &&
      aoi.value.min_y !== "" &&
      aoi.value.max_x !== "" &&
      aoi.value.max_y !== ""
    return aoi.value.title !== "" && coordsFilled && aoi.value.z !== ""
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
    // 1. Conversion des champs de l'UI en nombres
    const min_x = safeParseFloat(aoi.value.min_x)
    const min_y = safeParseFloat(aoi.value.min_y)
    const max_x = safeParseFloat(aoi.value.max_x)
    const max_y = safeParseFloat(aoi.value.max_y)
    const z = safeParseFloat(aoi.value.z)

    // Vérification NaN
    const hasNaN =
      isNaN(min_x) || isNaN(min_y) || isNaN(max_x) || isNaN(max_y) || isNaN(z)

    if (hasNaN) {
      console.error(
        "AOI creation failed: One or more coordinate values resulted in NaN after parsing. Check the input format."
      )
      loading.value = false
      return
    }

    // 2. Vérification que Min < Max pour chaque axe
    if (min_x >= max_x || min_y >= max_y) {
      console.error(
        "AOI creation failed: Min coordinates must be less than Max coordinates"
      )
      loading.value = false
      return
    }

    // 3. Génération des 4 points pour respecter le schéma existant
    // Ordre des points pour le rectangle (MinX, MinY), (MaxX, MinY), (MaxX, MaxY), (MinX, MaxY)
    const aoiPoints = [
      { x: min_x, y: min_y },
      { x: max_x, y: min_y },
      { x: max_x, y: max_y },
      { x: min_x, y: max_y },
    ]

    // 4. Construction du payload final CONFORME au schéma du backend
    const aoiData = {
      name: aoi.value.title,
      points: aoiPoints, // <- Le champ POINTS est généré ici
      z: z,
    }

    const aoiSchema = back_schemas.opengeodeweb_back.create.create_aoi

    if (!aoiSchema || typeof aoiSchema !== "object") {
      console.error(
        "FATAL ERROR: The AOI schema is missing or invalid at back_schemas.opengeodeweb_back.create.create_aoi"
      )
      loading.value = false
      return
    }

    // 5. Validation et appel API
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
      } catch (error) {
        console.error("API call failed during createAOI:", error)
      } finally {
        loading.value = false
      }
    } else {
      console.error(
        "Schema validation FAILED for AOI. Check console for AJV errors."
      )
    }
  }

  // Fonctions de sanitization et de gestion du collage
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

    const targetBase = aoi.value
    const xKey = `${type}_x`
    const yKey = `${type}_y`

    if (sanitized.length >= 2) {
      targetBase[xKey] = sanitized[0]
      targetBase[yKey] = sanitized[1]
      event.preventDefault()
    } else if (sanitized.length === 1) {
      if (field === "x") {
        targetBase[xKey] = sanitized[0]
      } else {
        targetBase[yKey] = sanitized[0]
      }
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

  const sanitizeInputAOI = (value, field) => {
    aoi.value[field] = sanitizeNumberString(value)
  }

  const sanitizeInputZAOI = (value) => {
    aoi.value.z = sanitizeNumberString(value)
  }
</script>
