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
import { Calculator, TrendingUp, Apple, Utensils, Target, Plus, Minus, Zap, Flame, Activity, Award, ChefHat, Dumbbell } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header com design moderno */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl mb-6 shadow-2xl">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              BulkMaster
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Transforme seu corpo com o assistente definitivo para ganho de massa muscular
            </p>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Cientificamente Baseado</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Resultados Rápidos</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="calculator" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2">
              <TabsTrigger 
                value="calculator" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline">Calculadora</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tracking" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Progresso</span>
              </TabsTrigger>
              <TabsTrigger 
                value="meals" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <ChefHat className="w-4 h-4" />
                <span className="hidden sm:inline">Refeições</span>
              </TabsTrigger>
              <TabsTrigger 
                value="foods" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Apple className="w-4 h-4" />
                <span className="hidden sm:inline">Alimentos</span>
              </TabsTrigger>
            </TabsList>

            {/* Calculadora com design aprimorado */}
            <TabsContent value="calculator">
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-500/20 to-pink-600/20 border-b border-white/10">
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    Calculadora de Calorias para Bulking
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Configure seus dados para calcular suas necessidades calóricas diárias
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="weight" className="text-white font-medium flex items-center gap-2">
                        <Activity className="w-4 h-4 text-orange-400" />
                        Peso (kg)
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        value={userData.weight}
                        onChange={(e) => setUserData({...userData, weight: Number(e.target.value)})}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl h-12 text-lg"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="height" className="text-white font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        Altura (cm)
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        value={userData.height}
                        onChange={(e) => setUserData({...userData, height: Number(e.target.value)})}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl h-12 text-lg"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="age" className="text-white font-medium flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        Idade
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        value={userData.age}
                        onChange={(e) => setUserData({...userData, age: Number(e.target.value)})}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl h-12 text-lg"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-white font-medium">Gênero</Label>
                      <Select value={userData.gender} onValueChange={(value: 'male' | 'female') => setUserData({...userData, gender: value})}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-white font-medium">Nível de Atividade</Label>
                      <Select value={userData.activityLevel} onValueChange={(value) => setUserData({...userData, activityLevel: value})}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="sedentary">Sedentário</SelectItem>
                          <SelectItem value="light">Leve (1-3x/semana)</SelectItem>
                          <SelectItem value="moderate">Moderado (3-5x/semana)</SelectItem>
                          <SelectItem value="active">Ativo (6-7x/semana)</SelectItem>
                          <SelectItem value="very_active">Muito Ativo (2x/dia)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-white font-medium">Meta de Bulking</Label>
                      <Select value={userData.goal} onValueChange={(value: 'moderate' | 'aggressive') => setUserData({...userData, goal: value})}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="moderate">Moderado (+300 cal)</SelectItem>
                          <SelectItem value="aggressive">Agressivo (+500 cal)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-gradient-to-br from-orange-500/20 to-pink-600/20 border border-orange-500/30 shadow-xl rounded-2xl overflow-hidden">
                      <CardContent className="pt-8 pb-8">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl mb-4">
                            <Flame className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-4xl font-bold text-white mb-2">{dailyCalories}</div>
                          <div className="text-orange-200 font-medium">Calorias por dia</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 shadow-xl rounded-2xl overflow-hidden">
                      <CardContent className="pt-8 pb-8">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-4">
                            <Zap className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-4xl font-bold text-white mb-2">{dailyProtein}g</div>
                          <div className="text-emerald-200 font-medium">Proteína por dia</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progresso com design aprimorado */}
            <TabsContent value="tracking">
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border-b border-white/10">
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    Progresso Diário
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Acompanhe seu consumo de calorias e proteínas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-white font-medium text-lg flex items-center gap-2">
                          <Flame className="w-5 h-5 text-orange-400" />
                          Calorias
                        </Label>
                        <span className="text-gray-300 font-medium">
                          {consumedCalories} / {dailyCalories} kcal
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={caloriesProgress} 
                          className="h-4 bg-white/10 rounded-full overflow-hidden"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full" 
                             style={{width: `${Math.min(caloriesProgress, 100)}%`}}></div>
                      </div>
                      <div className="text-center">
                        <Badge 
                          variant={caloriesProgress >= 100 ? "default" : "secondary"}
                          className={`px-4 py-2 text-sm font-medium rounded-full ${
                            caloriesProgress >= 100 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
                              : 'bg-white/20 text-gray-300'
                          }`}
                        >
                          {Math.round(caloriesProgress)}% da meta
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-white font-medium text-lg flex items-center gap-2">
                          <Zap className="w-5 h-5 text-emerald-400" />
                          Proteína
                        </Label>
                        <span className="text-gray-300 font-medium">
                          {consumedProtein} / {dailyProtein}g
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={proteinProgress} 
                          className="h-4 bg-white/10 rounded-full overflow-hidden"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" 
                             style={{width: `${Math.min(proteinProgress, 100)}%`}}></div>
                      </div>
                      <div className="text-center">
                        <Badge 
                          variant={proteinProgress >= 100 ? "default" : "secondary"}
                          className={`px-4 py-2 text-sm font-medium rounded-full ${
                            proteinProgress >= 100 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
                              : 'bg-white/20 text-gray-300'
                          }`}
                        >
                          {Math.round(proteinProgress)}% da meta
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl border border-blue-500/30">
                      <div className="text-3xl font-bold text-blue-400 mb-2">{consumedCalories}</div>
                      <div className="text-blue-200 font-medium">Consumidas</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl border border-emerald-500/30">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">{dailyCalories - consumedCalories}</div>
                      <div className="text-emerald-200 font-medium">Restantes</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl border border-purple-500/30">
                      <div className="text-3xl font-bold text-purple-400 mb-2">{consumedProtein}g</div>
                      <div className="text-purple-200 font-medium">Proteína</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl border border-orange-500/30">
                      <div className="text-3xl font-bold text-orange-400 mb-2">{meals.length}</div>
                      <div className="text-orange-200 font-medium">Refeições</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Refeições com design aprimorado */}
            <TabsContent value="meals">
              <div className="space-y-8">
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-b border-white/10">
                    <CardTitle className="flex items-center gap-3 text-2xl text-white">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                        <ChefHat className="w-6 h-6 text-white" />
                      </div>
                      Minhas Refeições
                    </CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      Adicione e gerencie suas refeições diárias
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia'].map((mealName) => (
                        <Button
                          key={mealName}
                          variant="outline"
                          onClick={() => addMeal(mealName)}
                          className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-transparent transition-all duration-300 rounded-xl h-12"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm font-medium">{mealName}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {meals.map((meal) => (
                  <Card key={meal.id} className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-b border-white/10">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl text-white flex items-center gap-3">
                          <Utensils className="w-5 h-5 text-blue-400" />
                          {meal.name}
                        </CardTitle>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-3 py-1 rounded-full">
                            {meal.totalCalories} kcal
                          </Badge>
                          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full">
                            {meal.totalProtein}g proteína
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMeal(meal.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {meal.foods.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                            <span className="text-white font-medium">{item.food.name} x{item.quantity}</span>
                            <span className="text-gray-300 font-medium">
                              {Math.round(item.food.calories * item.quantity)} kcal
                            </span>
                          </div>
                        ))}
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-white/10">
                          {bulkingFoods.slice(0, 6).map((food) => (
                            <Button
                              key={food.name}
                              variant="outline"
                              size="sm"
                              onClick={() => addFoodToMeal(meal.id, food, 1)}
                              className="bg-white/5 border-white/20 text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:border-transparent transition-all duration-300 rounded-xl text-xs p-3"
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

            {/* Alimentos com design aprimorado */}
            <TabsContent value="foods">
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-red-500/20 to-orange-600/20 border-b border-white/10">
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
                      <Apple className="w-6 h-6 text-white" />
                    </div>
                    Alimentos para Bulking
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Lista de alimentos ideais para ganho de massa muscular
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {['Proteína', 'Carboidrato', 'Gordura'].map((category, categoryIndex) => {
                      const categoryColors = [
                        'from-red-500 to-orange-600',
                        'from-blue-500 to-purple-600', 
                        'from-emerald-500 to-teal-600'
                      ]
                      const categoryBorders = [
                        'border-red-500/30',
                        'border-blue-500/30',
                        'border-emerald-500/30'
                      ]
                      
                      return (
                        <div key={category} className="space-y-4">
                          <div className={`text-center p-4 bg-gradient-to-r ${categoryColors[categoryIndex]}/20 rounded-2xl border ${categoryBorders[categoryIndex]}`}>
                            <h3 className="font-bold text-xl text-white">{category}s</h3>
                          </div>
                          {bulkingFoods
                            .filter(food => food.category === category)
                            .map((food) => (
                              <Card key={food.name} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div className="font-medium text-white text-sm">{food.name}</div>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div className="flex items-center gap-2 text-orange-300">
                                        <Flame className="w-3 h-3" />
                                        {food.calories} kcal
                                      </div>
                                      <div className="flex items-center gap-2 text-emerald-300">
                                        <Zap className="w-3 h-3" />
                                        {food.protein}g prot
                                      </div>
                                      <div className="flex items-center gap-2 text-blue-300">
                                        <Activity className="w-3 h-3" />
                                        {food.carbs}g carb
                                      </div>
                                      <div className="flex items-center gap-2 text-purple-300">
                                        <Target className="w-3 h-3" />
                                        {food.fats}g gord
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}