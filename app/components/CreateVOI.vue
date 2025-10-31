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
      Create Volume of Interest (Bounding Box)
    </v-card-title>

    <v-card-subtitle class="ma-0 text-medium-emphasis text-wrap">
      Select an existing AOI and define Z min/max coordinates to create a 3D
      volume.
    </v-card-subtitle>

    <v-card-text>
      <v-form ref="form">
        <v-text-field
          label="VOI Name"
          v-model="name"
          prepend-inner-icon="mdi-format-title"
          type="text"
          variant="outlined"
          color="primary"
          :rules="[(v) => !!v || 'Name is required']"
          required
          class="mb-4"
        />

        <v-select
          label="Select AOI"
          v-model="selectedAOI"
          :items="aoiList"
          item-title="name"
          item-value="id"
          prepend-inner-icon="mdi-vector-square"
          variant="outlined"
          color="primary"
          :rules="[(v) => !!v || 'AOI selection is required']"
          required
          class="mb-4"
          no-data-text="No AOI available. Please create an AOI first."
          @update:modelValue="onAOISelected"
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.name">
              <template #prepend>
                <v-img
                  src="/aoi.svg"
                  alt="AOI"
                  width="24"
                  height="24"
                  class="mr-2"
                />
              </template>
            </v-list-item>
          </template>
        </v-select>

        <v-card
          v-if="selectedAOICoordinates"
          variant="outlined"
          class="mb-4 pa-3"
        >
          <v-card-title class="text-subtitle-2 font-weight-medium">
            Selected AOI Coordinates
          </v-card-title>
          <v-card-text class="text-caption">
            <div>Min X: {{ selectedAOICoordinates.min_x }}</div>
            <div>Min Y: {{ selectedAOICoordinates.min_y }}</div>
            <div>Max X: {{ selectedAOICoordinates.max_x }}</div>
            <div>Max Y: {{ selectedAOICoordinates.max_y }}</div>
            <div v-if="selectedAOICoordinates.z">
              Z: {{ selectedAOICoordinates.z }}
            </div>
          </v-card-text>
        </v-card>

        <div class="mb-4">
          <p class="text-subtitle-1 font-weight-medium mb-2">
            Z Coordinates (Min / Max)
          </p>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                label="Z Min"
                v-model="z_min"
                prepend-inner-icon="mdi-axis-z-arrow"
                type="text"
                inputmode="decimal"
                variant="outlined"
                color="secondary"
                density="comfortable"
                :rules="[
                  (v) => !!v || 'Z Min is required',
                  (v) =>
                    !z_max ||
                    parseFloat(v) < parseFloat(z_max) ||
                    'Z Min must be less than Z Max',
                ]"
                @paste="handlePasteVOI($event, 'min')"
                @update:modelValue="(val) => sanitizeInputVOI(val, 'z_min')"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Z Max"
                v-model="z_max"
                prepend-inner-icon="mdi-axis-z-arrow"
                type="text"
                inputmode="decimal"
                variant="outlined"
                color="secondary"
                density="comfortable"
                :rules="[
                  (v) => !!v || 'Z Max is required',
                  (v) =>
                    !z_min ||
                    parseFloat(v) > parseFloat(z_min) ||
                    'Z Max must be greater than Z Min',
                ]"
                @paste="handlePasteVOI($event, 'max')"
                @update:modelValue="(val) => sanitizeInputVOI(val, 'z_max')"
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
        :disabled="!isFormFilled || !selectedAOICoordinates"
        @click="createVOI"
        class="text-none ml-4"
      >
        <v-icon start class="ml-1">mdi-send</v-icon>
        Create VOI
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
    UIStore.setShowCreateVOI(false)
  }

  const UIStore = useUIStore()
  const dataBaseStore = useDataBaseStore()
  const hybridViewerStore = useHybridViewerStore()

  const name = ref("")
  const selectedAOI = ref(null)
  const selectedAOICoordinates = ref(null)
  const z_min = ref("")
  const z_max = ref("")
  const loading = ref(false)

  const aoiList = computed(() => {
    const items = []
    for (const [id, item] of Object.entries(dataBaseStore.db)) {
      if (
        item.geode_object === "EdgedCurve3D" &&
        item.object_type === "mesh" &&
        item.displayed_name &&
        !item.aoi_id &&
        item.geode_object_data &&
        ((item.geode_object_data.min_x != null &&
          item.geode_object_data.max_x != null) ||
          (item.geode_object_data.points &&
            item.geode_object_data.points.length >= 2))
      ) {
        items.push({
          id: id,
          name: item.displayed_name || item.native_filename || id,
        })
      }
    }
    return items
  })

  const isFormFilled = computed(() => {
    return (
      name.value !== "" &&
      selectedAOI.value !== null &&
      z_min.value !== "" &&
      z_max.value !== ""
    )
  })

  const closeDrawer = () => {
    UIStore.setShowCreateVOI(false)
  }

  function visibleBoundingBox() {
    if (!hybridViewerStore.genericRenderWindow.value)
      return [-1, 1, -1, 1, -1, 1]
    const renderer = hybridViewerStore.genericRenderWindow.value.getRenderer()
    return renderer.computeVisiblePropBounds()
  }

  const initializeVOICoordinates = () => {
    const bounds = visibleBoundingBox()
    const boundsMinZ = bounds[4]
    const boundsMaxZ = bounds[5]

    const extentZ = boundsMaxZ - boundsMinZ
    const paddingZ = extentZ * 0.1

    const newMinZ = boundsMinZ - paddingZ
    const newMaxZ = boundsMaxZ + paddingZ

    z_min.value = newMinZ.toFixed(2)
    z_max.value = newMaxZ.toFixed(2)
  }

  const extractAOICoordinates = (aoiItem) => {
    if (!aoiItem) return null

    if (aoiItem.geode_object_data && aoiItem.geode_object_data.points) {
      const points = aoiItem.geode_object_data.points
      if (points.length >= 4) {
        const min_x = Math.min(...points.map((p) => p.x))
        const min_y = Math.min(...points.map((p) => p.y))
        const max_x = Math.max(...points.map((p) => p.x))
        const max_y = Math.max(...points.map((p) => p.y))
        const z = aoiItem.geode_object_data.z || 0

        return { min_x, min_y, max_x, max_y, z, points }
      }
    }

    return null
  }

  const onAOISelected = (aoiId) => {
    selectedAOICoordinates.value = null

    if (!aoiId) return

    const aoiItem = dataBaseStore.db[aoiId]
    if (aoiItem) {
      selectedAOICoordinates.value = extractAOICoordinates(aoiItem)
    }
  }

  onMounted(() => {
    initializeVOICoordinates()
  })

  watch(
    () => UIStore.showCreateVOI,
    (newVal) => {
      if (newVal) {
        initializeVOICoordinates()
        selectedAOICoordinates.value = null
        selectedAOI.value = null
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
          await dataBaseStore.addItem(data.id, {
            object_type: data.object_type,
            geode_object: data.geode_object,
            native_filename: data.native_file_name,
            viewable_filename: data.viewable_file_name,
            displayed_name: data.name,
            aoi_id: data.aoi_id,
            vtk_js: {
              binary_light_viewable: data.binary_light_viewable,
            },
          })
          closeDrawer()
        },
      },
    )
  }

  const createVOI = async () => {
    if (!name.value || !selectedAOI.value || !selectedAOICoordinates.value) {
      return
    }

    const z_min_val = parseFloat(z_min.value)
    const z_max_val = parseFloat(z_max.value)

    const voiData = {
      name: name.value,
      aoi_id: selectedAOI.value,
      min_x: selectedAOICoordinates.value.min_x,
      min_y: selectedAOICoordinates.value.min_y,
      max_x: selectedAOICoordinates.value.max_x,
      max_y: selectedAOICoordinates.value.max_y,
      z_min: z_min_val,
      z_max: z_max_val,
    }

    const voiSchema = back_schemas.opengeodeweb_back.create.create_voi

    loading.value = true
    try {
      await api_fetch(
        {
          schema: voiSchema,
          params: voiData,
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

  const handlePasteVOI = (event, type) => {
    const pastedText =
      (event && event.clipboardData && event.clipboardData.getData("text")) ||
      ""

    if (!pastedText) return

    const coordinates = pastedText.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g)
    if (!coordinates || coordinates.length === 0) return

    const sanitized = coordinates.map((c) => sanitizeNumberString(c))

    if (sanitized.length >= 2) {
      z_min.value = sanitized[0]
      z_max.value = sanitized[1]
      event.preventDefault()
    } else if (sanitized.length === 1) {
      if (type === "min") {
        z_min.value = sanitized[0]
      } else {
        z_max.value = sanitized[0]
      }
      event.preventDefault()
    }
  }

  const sanitizeInputVOI = (value, field) => {
    if (field === "z_min") z_min.value = sanitizeNumberString(value)
    else if (field === "z_max") z_max.value = sanitizeNumberString(value)
  }
</script>
