<script setup>
import { useBaseStatistics } from "@/composables/useBaseStatistics";
import { onMounted } from "vue";

const props = defineProps({
  bus: { type: Object, required: true }
});

const baseStats = useBaseStatistics(props, getStatistics);

baseStats.setupRefreshListener(fetchStatistics);

onMounted(function() {
  if (import.meta.hot) {
    if (import.meta.hot.data && import.meta.hot.data.statistics) {
      baseStats.statistics.value = import.meta.hot.data.statistics;
    }

    import.meta.hot.dispose(
      _data => _data["statistics"] = baseStats.statistics.value
    );
  }
});

function fetchStatistics() {}

function getStatistics(/* runIds, reportFilter, cmpData */) {}

defineExpose({
  fetchStatistics,
  fetchDifference: baseStats.fetchDifference,
  getStatistics,
  getStatisticsFilters: baseStats.getStatisticsFilters,
  statistics: baseStats.statistics
});
</script>