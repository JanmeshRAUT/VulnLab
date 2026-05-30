import { Search, ShoppingBag, BookOpen, User, Star, BookMarked, Library, Heart } from 'lucide-react';

export default function BookStore() {
  return (
    <div className="w-full bg-[#fcfaf8] font-serif text-stone-800 min-h-full">
      {/* Top Banner */}
      <div className="bg-[#5c4033] text-[#f4ecd8] text-center text-xs py-2 tracking-widest uppercase font-sans">
        Free Shipping on Orders Over $50
      </div>

      {/* Navigation */}
      <nav className="border-b border-[#e6dfd5] sticky top-0 z-10 bg-[#fcfaf8]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="text-[#8d6e63]" size={28} />
            <span className="text-3xl font-bold tracking-tight text-[#4e342e]">The <span className="italic font-light">BookStore</span></span>
          </div>
          
          <div className="hidden md:flex gap-8 font-sans text-sm font-medium text-stone-600 tracking-wide uppercase">
            <a href="#" className="hover:text-[#8d6e63] transition-colors">Fiction</a>
            <a href="#" className="hover:text-[#8d6e63] transition-colors">Non-Fiction</a>
            <a href="#" className="hover:text-[#8d6e63] transition-colors">Bestsellers</a>
            <a href="#" className="hover:text-[#8d6e63] transition-colors">Rare Finds</a>
          </div>

          <div className="flex items-center gap-5 text-[#5c4033]">
            <Search className="hover:text-[#8d6e63] cursor-pointer transition-colors" size={22} />
            <User className="hover:text-[#8d6e63] cursor-pointer transition-colors" size={22} />
            <div className="relative">
              <ShoppingBag className="hover:text-[#8d6e63] cursor-pointer transition-colors" size={22} />
              <span className="absolute -top-1.5 -right-1.5 bg-[#8d6e63] text-[#fcfaf8] font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-[#f4ecd8] border-b border-[#e6dfd5]">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#3e2723]">
              Discover your next <br />great adventure.
            </h1>
            <p className="text-xl text-[#5d4037] max-w-lg italic font-light">
              "A reader lives a thousand lives before he dies. The man who never reads lives only one."
            </p>
            <div className="pt-4 font-sans">
              <button className="bg-[#4e342e] hover:bg-[#3e2723] text-[#f4ecd8] px-8 py-3 font-medium tracking-widest uppercase text-sm transition-colors border border-[#4e342e]">
                Shop Bestsellers
              </button>
            </div>
          </div>
          <div className="flex-1 relative flex justify-center">
            {/* Book Mockup */}
            <div className="w-64 h-80 bg-[#8d6e63] shadow-2xl shadow-stone-900/20 rounded-r-xl border-l-4 border-l-[#5c4033] relative flex items-center justify-center text-center p-6 hover:scale-105 transition-transform duration-500 cursor-pointer">
               <div className="absolute top-4 right-4">
                 <Heart className="text-[#f4ecd8]/50 hover:text-red-400 transition-colors" size={20} />
               </div>
               <div>
                 <BookMarked size={48} className="text-[#f4ecd8] mx-auto mb-4 opacity-50" />
                 <h3 className="text-[#f4ecd8] font-bold text-2xl mb-2">The <br/>Silent Echo</h3>
                 <p className="text-[#f4ecd8]/70 italic text-sm">A. J. Novelist</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
           <h2 className="text-3xl font-bold text-[#4e342e]">Curated Collections</h2>
           <a href="#" className="font-sans text-sm font-bold text-[#8d6e63] uppercase tracking-wider hover:underline">View All</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 border border-[#e6dfd5] shadow-sm hover:shadow-md transition-shadow text-center group cursor-pointer">
            <Library size={32} className="mx-auto mb-4 text-[#8d6e63] group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-xl mb-2 text-[#4e342e]">Classic Literature</h3>
            <p className="text-stone-500 font-sans text-sm">Timeless masterpieces that shaped the literary world.</p>
          </div>
          <div className="bg-white p-8 border border-[#e6dfd5] shadow-sm hover:shadow-md transition-shadow text-center group cursor-pointer">
            <BookOpen size={32} className="mx-auto mb-4 text-[#8d6e63] group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-xl mb-2 text-[#4e342e]">Modern Fiction</h3>
            <p className="text-stone-500 font-sans text-sm">Contemporary voices and compelling new narratives.</p>
          </div>
          <div className="bg-white p-8 border border-[#e6dfd5] shadow-sm hover:shadow-md transition-shadow text-center group cursor-pointer">
            <Star size={32} className="mx-auto mb-4 text-[#8d6e63] group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-xl mb-2 text-[#4e342e]">Staff Picks</h3>
            <p className="text-stone-500 font-sans text-sm">Our team's favorite reads of the current month.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#f4ecd8] border-t border-[#e6dfd5] py-16 text-center font-sans">
        <div className="max-w-6xl mx-auto px-6">
          <BookOpen className="text-[#8d6e63] mx-auto mb-6" size={32} />
          <p className="text-[#5c4033] mb-8 max-w-md mx-auto">
            Dedicated to the written word. We believe in the power of a great story to change the world.
          </p>
          <div className="flex justify-center gap-8 text-sm font-bold text-[#8d6e63] uppercase tracking-widest mb-12">
            <a href="#" className="hover:text-[#4e342e]">About</a>
            <a href="#" className="hover:text-[#4e342e]">Locations</a>
            <a href="#" className="hover:text-[#4e342e]">Contact</a>
            <a href="#" className="hover:text-[#4e342e]">Policies</a>
          </div>
          <p className="text-[#8d6e63]/60 text-xs uppercase tracking-widest">
            &copy; 2026 The BookStore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
