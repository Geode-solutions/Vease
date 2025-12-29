import { useImportQueueStore } from "@ogw_front/stores/import_queue"
import { importFile } from "@ogw_front/utils/file_import_workflow"
import { upload_file } from "@ogw_front/composables/upload_file"

export function useFileImportWorkflow() {
  const importQueueStore = useImportQueueStore()

  async function handleFileImport(file, geode_object) {
    const queueId = importQueueStore.addToQueue(file.name)

    try {
      importQueueStore.updateStatus(queueId, "importing", 10)

      await upload_file({
        route: "/geode/upload_file",
        file: file,
      })

      importQueueStore.updateStatus(queueId, "importing", 50)

      await importFile(file.name, geode_object)

      importQueueStore.updateStatus(queueId, "success", 100)

      setTimeout(() => importQueueStore.removeFromQueue(queueId), 5000)
    } catch (error) {
      console.error("Failed to import file:", error)
      importQueueStore.updateStatus(queueId, "error", 0, error.message)
    }
  }

  return {
    handleFileImport,
  }
}
