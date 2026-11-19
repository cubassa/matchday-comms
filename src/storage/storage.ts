export function loadData<T>(
  key: string,
  defaultValue: T
): T {
  const saved = localStorage.getItem(key);

  if (!saved) {
    return defaultValue;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return defaultValue;
  }
}

export function saveData<T>(
  key: string,
  data: T
): void {
  localStorage.setItem(
    key,
    JSON.stringify(data)
  );
}