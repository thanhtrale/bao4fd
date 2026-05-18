export function useCategories() {
  function fetchCategories() {
    return useFetch('/api/categories')
  }

  return { fetchCategories }
}
