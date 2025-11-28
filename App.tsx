import React, { useState } from 'react';
import { Layout, StarRating, Button } from './components/UIComponents';
import { 
  LandingStep, 
  LoginStep, 
  DietaryStep, 
  MoodStep, 
  IngredientsStep, 
  MealTypeStep, 
  DifficultyStep, 
  GoalsStep, 
  CuisineStep,
  ProfileStep
} from './components/WizardSteps';
import { AppStep, UserProfile, Recipe, Rating } from './types';
import { generateRecipes } from './services/geminiService';

const InitialProfile: UserProfile = {
  name: '',
  age: '',
  email: '',
  dietary: '',
  mood: '',
  ingredients: [],
  mealType: '',
  difficulty: '',
  goals: [],
  cuisine: '',
  ratings: []
};

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LANDING);
  const [userProfile, setUserProfile] = useState<UserProfile>(InitialProfile);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const addRating = (rating: Rating) => {
    setUserProfile(prev => ({
      ...prev,
      ratings: [rating, ...prev.ratings]
    }));
  };

  const goToProfile = () => {
    setCurrentStep(AppStep.PROFILE);
  };

  const nextStep = () => {
    switch (currentStep) {
      case AppStep.LANDING: setCurrentStep(AppStep.LOGIN); break;
      case AppStep.LOGIN: setCurrentStep(AppStep.DIETARY); break;
      case AppStep.DIETARY: setCurrentStep(AppStep.MOOD); break;
      case AppStep.MOOD: setCurrentStep(AppStep.INGREDIENTS); break;
      case AppStep.INGREDIENTS: 
        if (userProfile.dietary === 'Non-Vegetarian') {
            setCurrentStep(AppStep.MEAL_TYPE);
        } else {
            setCurrentStep(AppStep.DIFFICULTY);
        }
        break;
      case AppStep.MEAL_TYPE: setCurrentStep(AppStep.DIFFICULTY); break;
      case AppStep.DIFFICULTY: setCurrentStep(AppStep.GOALS); break;
      case AppStep.GOALS: setCurrentStep(AppStep.CUISINE); break;
      case AppStep.CUISINE: 
        setCurrentStep(AppStep.RESULTS);
        fetchRecommendations();
        break;
      default: break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case AppStep.LOGIN: setCurrentStep(AppStep.LANDING); break;
      case AppStep.DIETARY: setCurrentStep(AppStep.LOGIN); break;
      case AppStep.MOOD: setCurrentStep(AppStep.DIETARY); break;
      case AppStep.INGREDIENTS: setCurrentStep(AppStep.MOOD); break;
      case AppStep.MEAL_TYPE: setCurrentStep(AppStep.INGREDIENTS); break;
      case AppStep.DIFFICULTY: 
        if (userProfile.dietary === 'Non-Vegetarian') {
          setCurrentStep(AppStep.MEAL_TYPE);
        } else {
          setCurrentStep(AppStep.INGREDIENTS);
        }
        break;
      case AppStep.GOALS: setCurrentStep(AppStep.DIFFICULTY); break;
      case AppStep.CUISINE: setCurrentStep(AppStep.GOALS); break;
      case AppStep.RESULTS: setCurrentStep(AppStep.CUISINE); break;
      case AppStep.PROFILE: setCurrentStep(AppStep.DIETARY); break;
      default: break;
    }
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await generateRecipes(userProfile);
      setRecipes(results);
      if (results.length === 0) setError("Couldn't generate recipes. Try changing your ingredients.");
    } catch (err) {
      setError("Something went wrong with the AI companion.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    const props = { 
      onNext: nextStep, 
      onBack: prevStep, 
      profile: userProfile, 
      updateProfile,
      onProfileClick: goToProfile 
    };

    switch (currentStep) {
      case AppStep.LANDING: return <LandingStep {...props} onBack={undefined} />;
      case AppStep.LOGIN: return <LoginStep {...props} />;
      case AppStep.DIETARY: return <DietaryStep {...props} />;
      case AppStep.MOOD: return <MoodStep {...props} />;
      case AppStep.INGREDIENTS: return <IngredientsStep {...props} />;
      case AppStep.MEAL_TYPE: return <MealTypeStep {...props} />;
      case AppStep.DIFFICULTY: return <DifficultyStep {...props} />;
      case AppStep.GOALS: return <GoalsStep {...props} />;
      case AppStep.CUISINE: return <CuisineStep {...props} />;
      case AppStep.PROFILE: return <ProfileStep {...props} />;
      case AppStep.RESULTS: return (
        <ResultsView 
          recipes={recipes} 
          isLoading={isLoading} 
          error={error} 
          onBack={prevStep} 
          onRetry={fetchRecommendations}
          onProfileClick={goToProfile}
          onRateDish={addRating}
        />
      );
      default: return null;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
}

// --- Results Sub-Component ---
const ResultsView: React.FC<{ 
  recipes: Recipe[], 
  isLoading: boolean, 
  error: string | null,
  onBack: () => void,
  onRetry: () => void,
  onProfileClick: () => void,
  onRateDish: (rating: Rating) => void
}> = ({ recipes, isLoading, error, onBack, onRetry, onProfileClick, onRateDish }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 bg-white">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-bold text-gray-800">Cooking up ideas...</h3>
        <p className="text-gray-500 text-center mt-2">Analyzing your kitchen and cravings.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Oops!</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-4">
            <button onClick={onBack} className="text-gray-500 underline">Back</button>
            <button onClick={onRetry} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center p-4 bg-white sticky top-0 shadow-sm z-10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
           <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
           </svg>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg">Top Picks for You</h1>
        <button onClick={onProfileClick} className="p-2 -mr-2 rounded-full hover:bg-gray-100">
           <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
           </svg>
        </button>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto flex-1 pb-10">
        {recipes.map((recipe, index) => (
          <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
            {/* Image Placeholder using Image.Pollinations with specific keyword */}
            <div className="h-48 bg-gray-200 relative group">
               <img 
                 src={`https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.imageKeyword || recipe.name)}%20dish%20food%20photography%20delicious%204k?width=600&height=400&nologo=true`} 
                 alt={recipe.name}
                 className="w-full h-full object-cover"
                 onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400/orange/white?text=Yummy!';
                 }}
               />
               <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-16">
                  <h2 className="text-white font-bold text-2xl leading-tight drop-shadow-md">{recipe.name}</h2>
               </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                 <span className="flex items-center gap-1 font-medium text-gray-700">
                    🕒 {recipe.cookingTimeMinutes} mins
                 </span>
                 <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Match
                 </span>
              </div>
              
              <p className="text-gray-600 mb-4 italic text-sm border-l-4 border-orange-300 pl-3 bg-orange-50/50 py-2 rounded-r-lg">
                "{recipe.matchReason}"
              </p>

              {expandedIndex === index ? (
                <div className="animate-fade-in">
                   <div className="mb-4">
                      <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                         <span>🥕</span> Ingredients
                      </h3>
                      <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        {recipe.ingredients.map((ing, i) => (
                          <li key={i} className="flex items-center gap-2">
                             <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                             {ing}
                          </li>
                        ))}
                      </ul>
                   </div>

                   <div>
                      <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                         <span>👨‍🍳</span> Instructions
                      </h3>
                      <ol className="list-decimal list-inside text-sm text-gray-700 space-y-3">
                        {recipe.steps.map((step, i) => (
                          <li key={i} className="pl-1 leading-relaxed"><span className="ml-1">{step}</span></li>
                        ))}
                      </ol>
                   </div>
                   
                   <div className="mt-8 pt-4 border-t border-gray-100">
                     <p className="font-semibold text-gray-700 mb-2 text-center">Tried this? Rate it!</p>
                     <RatingForm 
                       dishName={recipe.name} 
                       onSubmit={onRateDish}
                     />
                   </div>

                   <button 
                     onClick={() => setExpandedIndex(null)}
                     className="w-full mt-6 py-3 text-orange-600 font-semibold border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors"
                   >
                     Show Less
                   </button>
                </div>
              ) : (
                <button 
                  onClick={() => setExpandedIndex(index)}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-orange-200 shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  View Recipe
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Rating Form Component ---
const RatingForm: React.FC<{ dishName: string, onSubmit: (r: Rating) => void }> = ({ dishName, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit({
        dishName,
        stars: rating,
        comment,
        timestamp: Date.now()
      });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-4 bg-green-50 rounded-xl text-green-700 animate-pulse border border-green-200">
        <span className="text-xl block mb-1">✅</span> 
        <span className="font-semibold">Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <StarRating rating={rating} onRate={setRating} />
      <input 
        placeholder="Any comments? (Optional)"
        className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-white"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button 
        variant="primary" 
        onClick={handleSubmit} 
        disabled={rating === 0}
        className="py-2 text-sm w-full"
      >
        Submit Rating
      </Button>
    </div>
  );
};

export default App;