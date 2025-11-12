"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calculator, TrendingUp, Apple, Utensils, Target, Plus, Minus } from 'lucide-react'

interface UserData {
  weight: number
  height: number
  age: number
  gender: 'male' | 'female'
  activityLevel: string
  goal: 'moderate' | 'aggressive'
}

interface Food {
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  category: string
}

interface Meal {
  id: string
  name: string
  foods: { food: Food; quantity: number }[]
  totalCalories: number
  totalProtein: number
}

const bulkingFoods: Food[] = [
  // Proteínas
  { name: 'Peito de Frango (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6, category: 'Proteína' },
  { name: 'Ovos (2 unidades)', calories: 140, protein: 12, carbs: 1, fats: 10, category: 'Proteína' },
  { name: 'Salmão (100g)', calories: 208, protein: 20, carbs: 0, fats: 13, category: 'Proteína' },
  { name: 'Carne Vermelha Magra (100g)', calories: 250, protein: 26, carbs: 0, fats: 15, category: 'Proteína' },
  { name: 'Whey Protein (30g)', calories: 120, protein: 24, carbs: 2, fats: 1, category: 'Proteína' },
  
  // Carboidratos
  { name: 'Arroz Integral (100g cozido)', calories: 111, protein: 2.6, carbs: 23, fats: 0.9, category: 'Carboidrato' },
  { name: 'Batata Doce (100g)', calories: 86, protein: 1.6, carbs: 20, fats: 0.1, category: 'Carboidrato' },
  { name: 'Aveia (50g)', calories: 190, protein: 6.5, carbs: 32, fats: 3.5, category: 'Carboidrato' },
  { name: 'Banana (1 média)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, category: 'Carboidrato' },
  { name: 'Pão Integral (2 fatias)', calories: 160, protein: 6, carbs: 28, fats: 2.5, category: 'Carboidrato' },
  
  // Gorduras Saudáveis
  { name: 'Abacate (1/2 unidade)', calories: 160, protein: 2, carbs: 8.5, fats: 15, category: 'Gordura' },
  { name: 'Castanhas (30g)', calories: 185, protein: 4.5, carbs: 3.5, fats: 18, category: 'Gordura' },
  { name: 'Azeite (1 colher sopa)', calories: 120, protein: 0, carbs: 0, fats: 14, category: 'Gordura' },
  { name: 'Amendoim (30g)', calories: 170, protein: 7, carbs: 5, fats: 14, category: 'Gordura' },
]

export default function BulkingApp() {
  const [userData, setUserData] = useState<UserData>({
    weight: 70,
    height: 175,
    age: 25,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'moderate'
  })
  
  const [dailyCalories, setDailyCalories] = useState(0)
  const [dailyProtein, setDailyProtein] = useState(0)
  const [meals, setMeals] = useState<Meal[]>([])
  const [consumedCalories, setConsumedCalories] = useState(0)
  const [consumedProtein, setConsumedProtein] = useState(0)

  // Calcular necessidades calóricas
  const calculateCalories = () => {
    let bmr = 0
    
    // Fórmula Mifflin-St Jeor
    if (userData.gender === 'male') {
      bmr = 88.362 + (13.397 * userData.weight) + (4.799 * userData.height) - (5.677 * userData.age)
    } else {
      bmr = 447.593 + (9.247 * userData.weight) + (3.098 * userData.height) - (4.330 * userData.age)
    }
    
    // Multiplicador de atividade
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }
    
    const tdee = bmr * activityMultipliers[userData.activityLevel as keyof typeof activityMultipliers]
    
    // Surplus para bulking
    const surplus = userData.goal === 'moderate' ? 300 : 500
    const totalCalories = Math.round(tdee + surplus)
    const protein = Math.round(userData.weight * 2.2) // 2.2g por kg
    
    setDailyCalories(totalCalories)
    setDailyProtein(protein)
  }

  useEffect(() => {
    calculateCalories()
  }, [userData])

  useEffect(() => {
    const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0)
    const totalProtein = meals.reduce((sum, meal) => sum + meal.totalProtein, 0)
    setConsumedCalories(totalCalories)
    setConsumedProtein(totalProtein)
  }, [meals])

  const addMeal = (mealName: string) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: mealName,
      foods: [],
      totalCalories: 0,
      totalProtein: 0
    }
    setMeals([...meals, newMeal])
  }

  const addFoodToMeal = (mealId: string, food: Food, quantity: number) => {
    setMeals(meals.map(meal => {
      if (meal.id === mealId) {
        const newFoods = [...meal.foods, { food, quantity }]
        const totalCalories = newFoods.reduce((sum, item) => sum + (item.food.calories * item.quantity), 0)
        const totalProtein = newFoods.reduce((sum, item) => sum + (item.food.protein * item.quantity), 0)
        
        return {
          ...meal,
          foods: newFoods,
          totalCalories: Math.round(totalCalories),
          totalProtein: Math.round(totalProtein)
        }
      }
      return meal
    }))
  }

  const removeMeal = (mealId: string) => {
    setMeals(meals.filter(meal => meal.id !== mealId))
  }

  const caloriesProgress = dailyCalories > 0 ? (consumedCalories / dailyCalories) * 100 : 0
  const proteinProgress = dailyProtein > 0 ? (consumedProtein / dailyProtein) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <TrendingUp className="text-blue-600" />
            BulkMaster
          </h1>
          <p className="text-xl text-gray-600">Seu assistente para ganho de massa muscular</p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:mx-auto">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Calculadora</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Progresso</span>
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">Refeições</span>
            </TabsTrigger>
            <TabsTrigger value="foods" className="flex items-center gap-2">
              <Apple className="w-4 h-4" />
              <span className="hidden sm:inline">Alimentos</span>
            </TabsTrigger>
          </TabsList>

          {/* Calculadora */}
          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="text-blue-600" />
                  Calculadora de Calorias para Bulking
                </CardTitle>
                <CardDescription>
                  Configure seus dados para calcular suas necessidades calóricas diárias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={userData.weight}
                      onChange={(e) => setUserData({...userData, weight: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={userData.height}
                      onChange={(e) => setUserData({...userData, height: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      value={userData.age}
                      onChange={(e) => setUserData({...userData, age: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Gênero</Label>
                    <Select value={userData.gender} onValueChange={(value: 'male' | 'female') => setUserData({...userData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Nível de Atividade</Label>
                    <Select value={userData.activityLevel} onValueChange={(value) => setUserData({...userData, activityLevel: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentário</SelectItem>
                        <SelectItem value="light">Leve (1-3x/semana)</SelectItem>
                        <SelectItem value="moderate">Moderado (3-5x/semana)</SelectItem>
                        <SelectItem value="active">Ativo (6-7x/semana)</SelectItem>
                        <SelectItem value="very_active">Muito Ativo (2x/dia)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Meta de Bulking</Label>
                    <Select value={userData.goal} onValueChange={(value: 'moderate' | 'aggressive') => setUserData({...userData, goal: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moderate">Moderado (+300 cal)</SelectItem>
                        <SelectItem value="aggressive">Agressivo (+500 cal)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{dailyCalories}</div>
                        <div className="text-sm text-gray-600">Calorias por dia</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{dailyProtein}g</div>
                        <div className="text-sm text-gray-600">Proteína por dia</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progresso */}
          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-green-600" />
                  Progresso Diário
                </CardTitle>
                <CardDescription>
                  Acompanhe seu consumo de calorias e proteínas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">Calorias</Label>
                      <span className="text-sm text-gray-600">
                        {consumedCalories} / {dailyCalories} kcal
                      </span>
                    </div>
                    <Progress value={caloriesProgress} className="h-3" />
                    <div className="text-center">
                      <Badge variant={caloriesProgress >= 100 ? "default" : "secondary"}>
                        {Math.round(caloriesProgress)}% da meta
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">Proteína</Label>
                      <span className="text-sm text-gray-600">
                        {consumedProtein} / {dailyProtein}g
                      </span>
                    </div>
                    <Progress value={proteinProgress} className="h-3" />
                    <div className="text-center">
                      <Badge variant={proteinProgress >= 100 ? "default" : "secondary"}>
                        {Math.round(proteinProgress)}% da meta
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{consumedCalories}</div>
                    <div className="text-sm text-gray-600">Consumidas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{dailyCalories - consumedCalories}</div>
                    <div className="text-sm text-gray-600">Restantes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{consumedProtein}g</div>
                    <div className="text-sm text-gray-600">Proteína</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{meals.length}</div>
                    <div className="text-sm text-gray-600">Refeições</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Refeições */}
          <TabsContent value="meals">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="text-orange-600" />
                    Minhas Refeições
                  </CardTitle>
                  <CardDescription>
                    Adicione e gerencie suas refeições diárias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia'].map((mealName) => (
                      <Button
                        key={mealName}
                        variant="outline"
                        size="sm"
                        onClick={() => addMeal(mealName)}
                        className="flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        {mealName}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {meals.map((meal) => (
                <Card key={meal.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{meal.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{meal.totalCalories} kcal</Badge>
                        <Badge variant="secondary">{meal.totalProtein}g proteína</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMeal(meal.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {meal.foods.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>{item.food.name} x{item.quantity}</span>
                          <span className="text-sm text-gray-600">
                            {Math.round(item.food.calories * item.quantity)} kcal
                          </span>
                        </div>
                      ))}
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {bulkingFoods.slice(0, 6).map((food) => (
                          <Button
                            key={food.name}
                            variant="outline"
                            size="sm"
                            onClick={() => addFoodToMeal(meal.id, food, 1)}
                            className="text-xs"
                          >
                            + {food.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Alimentos */}
          <TabsContent value="foods">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="text-red-600" />
                  Alimentos para Bulking
                </CardTitle>
                <CardDescription>
                  Lista de alimentos ideais para ganho de massa muscular
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Proteína', 'Carboidrato', 'Gordura'].map((category) => (
                    <div key={category} className="space-y-3">
                      <h3 className="font-semibold text-lg border-b pb-2">{category}s</h3>
                      {bulkingFoods
                        .filter(food => food.category === category)
                        .map((food) => (
                          <Card key={food.name} className="p-3">
                            <div className="space-y-2">
                              <div className="font-medium text-sm">{food.name}</div>
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>{food.calories} kcal</div>
                                <div>{food.protein}g prot</div>
                                <div>{food.carbs}g carb</div>
                                <div>{food.fats}g gord</div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}