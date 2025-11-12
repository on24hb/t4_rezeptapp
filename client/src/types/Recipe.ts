// Kopie des Interfaces aus server/recipe.ts
export interface Recipe {
  id: string
  userId: string
  title: string
  ingredients: string[]
  instructions: string
  tags?: string[]
  isFavorite: boolean
}
