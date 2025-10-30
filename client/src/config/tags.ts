// Definiert die verfügbaren Tags und die zugehörige CSS-Klasse für die Farbe
export const availableTags = [
  { name: 'schnell', colorClass: 'tag-color-3' },
  { name: 'vegetarisch', colorClass: 'tag-color-4' },
  { name: 'vegan', colorClass: 'tag-color-2' },
  { name: 'herzhaft', colorClass: 'tag-color-5' },
  { name: 'süß', colorClass: 'tag-color-6' },
  { name: 'getränk', colorClass: 'tag-color-1' },
] as const

// Hilfstyp, um nur gültige Tag-Namen zu erlauben
export type TagName = (typeof availableTags)[number]['name']

// Funktion, um die Farbklasse für einen Tag-Namen zu bekommen
export function getTagColorClassByName(tagName: TagName | string): string {
  const foundTag = availableTags.find((tag) => tag.name === tagName)
  return foundTag ? foundTag.colorClass : 'tag-color-1' // Fallback auf Grau
}
