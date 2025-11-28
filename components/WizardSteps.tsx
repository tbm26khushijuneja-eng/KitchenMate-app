import React, { useState } from 'react';
import { Button, Input, SelectionCard, ImageCard, Header } from './UIComponents';
import { UserProfile } from '../types';

// --- Shared Props for Steps ---
interface StepProps {
  onNext: () => void;
  onBack?: () => void;
  onProfileClick?: () => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

// 1. Landing (Redesigned Aesthetic)
export const LandingStep = ({ onNext }: StepProps) => (
  <div className="flex flex-col h-full bg-white relative animate-fade-in">
    {/* Top Section - Image & Art */}
    <div className="h-[55%] relative bg-orange-50 overflow-hidden rounded-b-[40px] shadow-xl z-10">
      <img 
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop" 
        alt="Fresh Ingredients" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      
      {/* Decorative Floating Elements */}
      <div className="absolute top-10 right-6 animate-float bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-lg transform rotate-6 border border-white/50">
         <span className="text-3xl">🥗</span>
      </div>
      <div className="absolute bottom-12 left-6 animate-float-delayed bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-lg transform -rotate-6 border border-white/50">
         <span className="text-3xl">🥑</span>
      </div>
    </div>

    {/* Bottom Section - Content */}
    <div className="flex-1 flex flex-col items-center p-8 text-center -mt-10 relative z-20">
      {/* Logo Placeholder */}
      <div className="bg-white p-5 rounded-3xl shadow-xl mb-6 border-4 border-orange-50 flex items-center justify-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-orange-100 p-3 rounded-2xl">
          <span className="text-4xl">🍳</span>
        </div>
      </div>

      <div className="animate-slide-up space-y-2" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          KitchenMate
        </h1>
        <p className="text-lg font-bold text-orange-600 tracking-wide uppercase text-xs">
          Cook Smart. Eat Happy.
        </p>
      </div>
      
      <p className="text-gray-500 mt-6 mb-8 leading-relaxed max-w-xs animate-slide-up" style={{ animationDelay: '0.3s' }}>
        Discover delicious recipes based on the ingredients you already have. No waste, just great taste.
      </p>

      <div className="w-full mt-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <Button 
          onClick={onNext} 
          variant="primary" 
          fullWidth 
          className="text-lg py-4 shadow-orange-500/30 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          Get Started
        </Button>
      </div>
    </div>
  </div>
);

// 2. Login
export const LoginStep = ({ onNext, onBack, profile, updateProfile }: StepProps) => {
  const [localName, setLocalName] = useState(profile.name);
  const [localAge, setLocalAge] = useState(profile.age);
  const [localEmail, setLocalEmail] = useState(profile.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localName && localAge) {
      updateProfile({ name: localName, age: localAge, email: localEmail });
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <Header onBack={onBack} title="Welcome" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-8 text-center">
           <span className="text-5xl inline-block animate-bounce mb-2">👋</span>
           <h2 className="text-2xl font-bold text-gray-800 mt-2">Let's get set up!</h2>
           <p className="text-gray-500">Tell us a bit about yourself.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <Input label="Name" placeholder="Enter your name" value={localName} onChange={(e) => setLocalName(e.target.value)} required />
          <Input label="Age" type="number" placeholder="Enter your age" value={localAge} onChange={(e) => setLocalAge(e.target.value)} required />
          <Input label="Email" type="email" placeholder="name@example.com" value={localEmail} onChange={(e) => setLocalEmail(e.target.value)} required />
          <Input label="Password" type="password" placeholder="••••••••" required />
          
          <div className="mt-auto pt-6">
            <Button type="submit" fullWidth disabled={!localName || !localAge}>Continue</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Dietary Preference
export const DietaryStep = ({ onNext, onBack, onProfileClick, profile, updateProfile }: StepProps) => {
  const options = [
    { label: 'Vegetarian', icon: '🥦' },
    { label: 'Non-Vegetarian', icon: '🍗' },
    { label: 'Vegan', icon: '🌱' },
    { label: 'Eggetarian', icon: '🥚' },
    { label: 'Gluten-Free', icon: '🌾' },
    { label: 'Pescatarian', icon: '🐟' }
  ];

  const handleSelect = (option: string) => {
    updateProfile({ dietary: option });
    setTimeout(onNext, 150);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <Header onBack={onBack} title="Dietary Preference" onProfileClick={onProfileClick} />
      <div className="p-6">
        <p className="text-lg font-bold text-gray-800 mb-6 text-center">What's your dietary style?</p>
        <div className="grid grid-cols-2 gap-4">
          {options.map((opt) => (
            <SelectionCard 
              key={opt.label}
              label={opt.label}
              icon={opt.icon}
              selected={profile.dietary === opt.label}
              onClick={() => handleSelect(opt.label)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. Food Mood
export const MoodStep = ({ onNext, onBack, onProfileClick, profile, updateProfile }: StepProps) => {
  const moods = [
    { label: 'Comfort Food', icon: '🥘', sub: 'Warm & hearty' },
    { label: 'Spicy', icon: '🌶️', sub: 'Bring the heat' },
    { label: 'Quick & Easy', icon: '⚡', sub: 'Ready fast' },
    { label: 'Healthy Vibes', icon: '🥗', sub: 'Nutritious' },
    { label: 'Indulgent', icon: '🍔', sub: 'Treat yourself' },
    { label: 'Light & Fresh', icon: '🍋', sub: 'Low calorie' },
  ];

  const handleSelect = (mood: string) => {
    updateProfile({ mood });
    setTimeout(onNext, 150);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <Header onBack={onBack} title="Current Mood" onProfileClick={onProfileClick} />
      <div className="p-6">
        <p className="text-lg font-bold text-gray-800 mb-6 text-center">What are you craving today?</p>
        <div className="grid grid-cols-2 gap-4">
          {moods.map((m) => (
            <SelectionCard 
              key={m.label}
              label={m.label}
              icon={m.icon}
              subtext={m.sub}
              selected={profile.mood === m.label}
              onClick={() => handleSelect(m.label)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Ingredients
export const IngredientsStep = ({ onNext, onBack, onProfileClick, profile, updateProfile }: StepProps) => {
  const quickAdds = ['Egg', 'Spinach', 'Corn', 'Chicken', 'Bread', 'Paneer', 'Tomato', 'Cheese', 'Onion', 'Pasta', 'Rice', 'Potato'];
  const [inputValue, setInputValue] = useState('');

  const toggleIngredient = (ing: string) => {
    const current = profile.ingredients;
    if (current.includes(ing)) {
      updateProfile({ ingredients: current.filter(i => i !== ing) });
    } else {
      updateProfile({ ingredients: [...current, ing] });
    }
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (!profile.ingredients.includes(inputValue.trim())) {
        updateProfile({ ingredients: [...profile.ingredients, inputValue.trim()] });
      }
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <Header onBack={onBack} title="Your Kitchen" onProfileClick={onProfileClick} />
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-lg font-bold text-gray-800 mb-4">What's in your kitchen?</p>
        
        <form onSubmit={handleAddManual} className="flex gap-2 mb-6">
          <input 
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Type ingredient..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="bg-gray-800 text-white px-4 rounded-xl font-bold text-xl shadow-md active:scale-95 transition-transform">+</button>
        </form>

        {profile.ingredients.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 animate-slide-up">
            {profile.ingredients.map(ing => (
              <span key={ing} className="bg-white text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-orange-200 shadow-sm">
                {ing}
                <button onClick={() => toggleIngredient(ing)} className="hover:text-red-500 ml-1">×</button>
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mb-3 font-bold uppercase tracking-wider">Quick Add</p>
        <div className="grid grid-cols-3 gap-3 overflow-y-auto pb-4 no-scrollbar">
          {quickAdds.map(ing => (
            <button
              key={ing}
              onClick={() => toggleIngredient(ing)}
              className={`p-2 rounded-lg text-sm border transition-all duration-200 ${
                profile.ingredients.includes(ing) 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-105' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              {ing}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4">
           <Button fullWidth onClick={onNext} disabled={profile.ingredients.length === 0}>
             Show Me Recipes ({profile.ingredients.length})
           </Button>
        </div>
      </div>
    </div>
  );
};

// 6. Meal Type (Redesigned with Image Cards)
export const MealTypeStep = ({ onNext, onBack, onProfileClick, profile, updateProfile }: StepProps) => {
  const types = [
    { label: 'Breakfast', icon: '🍳', img: 'https://images.unsplash.com/photo-1533089862017-5f32f0e553f7?auto=format&fit=crop&w=500&q=80' },
    { label: 'Lunch', icon: '🍱', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80' },
    { label: 'Dinner', icon: '🍽️', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80' },
    { label: 'Snacks', icon: '🥨', img: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=500&q=80' },
    { label: 'Dessert', icon: '🍰', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80' },
    { label: 'Drinks', icon: '🍹', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80' },
  ];

  const handleSelect = (mealType: string) => {
    updateProfile({ mealType });
    setTimeout(onNext, 150);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <Header onBack={onBack} title="Meal Type" onProfileClick={onProfileClick} />
      <div className="p-6">
        <p className="text-lg font-bold text-gray-800 mb-6 text-center">Which meal is this for?</p>
        <div className="grid grid-cols-2 gap-4 pb-4">
          {types.map((type) => (
            <ImageCard 
              key={type.label}
              label={type.label}
              icon={type.icon}
              imageSrc={type.img}
              selected={profile.mealType === type.label}
              onClick={() => handleSelect(type.label)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. Difficulty
export const DifficultyStep = ({ onNext, onBack, onProfileClick, profile, updateProfile }: StepProps) => {
  const levels = [
    { label: 'Easy', icon: '🟢' }, 
    { label: 'Medium', icon: '🟡' }, 
    { label: 'Expert', icon: '🔴' }
  ];

  const handleSelect = (difficulty: string) => {
    updateProfile({ difficulty });
    setTimeout(onNext, 150);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <Header onBack={onBack} title="Difficulty" onProfileClick={onProfileClick} />
      <div className="p-6">
        <p className="text-lg font-bold text-gray-800 mb-6 text-center">How much effort today?</p>
        <div className="flex flex-col gap-4">
          {levels.map((lvl) => (
            <button
              key={lvl.label}
              onClick={() => handleSelect(lvl.label)}
              className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-4 ${
                profile.difficulty === lvl.label
                  ? 'border-orange-500 bg-orange-50 transform scale-[1.02]' 
                  : 'border-gray-200 bg-white hover:border-orange-200'
              }`}
            >
              <span className="text-2xl">{lvl.icon}</span>
              <div>
                <div className="font-bold text-lg text-gray-800">{lvl.label}</div>
                <div className="text-sm text-gray-500 mt-1">
                    {lvl.label === 'Easy' && 'Quick & simple prep.'}
                    {lvl.label === 'Medium' && 'Standard cooking time.'}
                    {lvl.label === 'Expert' && 'Complex & gourmet.'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 8. Goals
export const GoalsStep = ({ onNext, onBack, onProfileClick, profile, updateProfile }: StepProps) => {
  const goals = ['Weight Loss', 'Energy Boost', 'Muscle Gain', 'High Protein', 'Low Carb', 'No Specific Goal'];

  const toggleGoal = (goal: string) => {
    if (goal === 'No Specific Goal') {
      updateProfile({ goals: ['No Specific Goal'] });
      return;
    }
    
    let current = profile.goals.filter(g => g !== 'No Specific Goal');
    if (current.includes(goal)) {
      current = current.filter(g => g !== goal);
    } else {
      current = [...current, goal];
    }
    updateProfile({ goals: current });
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <Header onBack={onBack} title="Health Goals" onProfileClick={onProfileClick} />
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-lg font-bold text-gray-800 mb-6">Any specific focus?</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {goals.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                profile.goals.includes(goal)
                  ? 'bg-green-100 text-green-800 ring-2 ring-green-500 shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
        <div className="mt-auto">
          <Button fullWidth onClick={onNext} disabled={profile.goals.length === 0}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

// 9. Cuisine
export const CuisineStep = ({ onNext, onBack, onProfileClick, profile, updateProfile }: StepProps) => {
  const cuisines = [
    { label: 'Indian', icon: '🍛' },
    { label: 'Italian', icon: '🍝' },
    { label: 'Mexican', icon: '🌮' },
    { label: 'Chinese', icon: '🥡' },
    { label: 'Thai', icon: '🍜' },
    { label: 'Mediterranean', icon: '🥙' },
    { label: 'Continental', icon: '🥐' },
    { label: 'Fusion', icon: '🌯' },
  ];

  const handleSelect = (cuisine: string) => {
    updateProfile({ cuisine });
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <Header onBack={onBack} title="Flavor Profile" onProfileClick={onProfileClick} />
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-lg font-bold text-gray-800 mb-6 text-center">Pick a cuisine</p>
        <div className="grid grid-cols-2 gap-4 mb-8 overflow-y-auto no-scrollbar pb-4">
          {cuisines.map((c) => (
            <SelectionCard 
              key={c.label}
              label={c.label}
              icon={c.icon}
              selected={profile.cuisine === c.label}
              onClick={() => handleSelect(c.label)}
            />
          ))}
        </div>
        <div className="mt-auto">
          <Button fullWidth onClick={onNext} disabled={!profile.cuisine} className="animate-pulse hover:animate-none">
            Recommend me a Dish ✨
          </Button>
        </div>
      </div>
    </div>
  );
};

// 10. Profile View & Edit
export const ProfileStep = ({ onBack, profile, updateProfile }: StepProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(profile.name);
  const [localAge, setLocalAge] = useState(profile.age);
  const [localEmail, setLocalEmail] = useState(profile.email);

  const handleSave = () => {
    updateProfile({ name: localName, age: localAge, email: localEmail });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full bg-white animate-fade-in">
      <Header onBack={onBack} title="Your Profile" />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-orange-500 p-8 flex flex-col items-center text-white rounded-b-[40px] shadow-lg mb-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl mb-3 shadow-lg text-orange-500 font-bold border-4 border-orange-300">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="opacity-90">{profile.email}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h3 className="font-bold text-gray-700">Personal Info</h3>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
              className="text-orange-600 text-sm font-semibold hover:text-orange-700"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
          
          <div className="space-y-4">
             {isEditing ? (
               <>
                 <Input label="Name" value={localName} onChange={e => setLocalName(e.target.value)} />
                 <Input label="Age" value={localAge} onChange={e => setLocalAge(e.target.value)} />
                 <Input label="Email" value={localEmail} onChange={e => setLocalEmail(e.target.value)} />
               </>
             ) : (
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">AGE</span>
                    <span className="font-bold text-gray-800 text-lg">{profile.age} <span className="text-sm font-normal text-gray-500">years</span></span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">DIETARY</span>
                    <span className="font-bold text-gray-800 text-lg truncate">{profile.dietary || '-'}</span>
                  </div>
               </div>
             )}
          </div>

          <div className="border-b border-gray-100 pb-2 mt-8">
            <h3 className="font-bold text-gray-700">Cooking Stats</h3>
          </div>
          
          <div className="space-y-3">
             <div className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                <span className="text-gray-600 font-medium">Rated Dishes</span>
                <span className="font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{profile.ratings.length}</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                <span className="text-gray-600 font-medium">Favorite Cuisine</span>
                <span className="font-bold text-gray-800">{profile.cuisine || '-'}</span>
             </div>
          </div>

          {profile.ratings.length > 0 && (
            <div className="mt-8 pb-10">
               <h3 className="font-bold text-gray-700 mb-4">Recently Rated</h3>
               <div className="space-y-3">
                 {profile.ratings.slice(0, 3).map((r, i) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl shadow-sm bg-white">
                       <div className="flex justify-between items-start">
                          <span className="font-bold text-gray-800 text-sm">{r.dishName}</span>
                          <span className="text-yellow-500 text-xs font-medium bg-yellow-50 px-2 py-1 rounded-lg">★ {r.stars}</span>
                       </div>
                       {r.comment && <p className="text-xs text-gray-500 mt-2 italic bg-gray-50 p-2 rounded-lg">"{r.comment}"</p>}
                    </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};