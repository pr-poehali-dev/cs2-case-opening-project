import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface CaseItem {
  id: number;
  name: string;
  price: number;
  rarity: Rarity;
  image: string;
  drops: Omit<InventoryItem, 'id'>[];
}

interface InventoryItem {
  id: number;
  name: string;
  rarity: Rarity;
  value: number;
  image: string;
}

interface UserStats {
  totalOpened: number;
  totalSpent: number;
  totalWon: number;
  balance: number;
  level: number;
  exp: number;
  lastFreeCase?: number;
}

const rarityColors: Record<Rarity, string> = {
  common: 'text-gray-400',
  rare: 'text-primary',
  epic: 'text-secondary',
  legendary: 'text-accent',
};

const rarityBorders: Record<Rarity, string> = {
  common: 'border-gray-400/30',
  rare: 'border-primary/30',
  epic: 'border-secondary/30',
  legendary: 'border-accent/30',
};

const possibleItems: Omit<InventoryItem, 'id'>[] = [
  { name: 'P250 | Sand Dune', rarity: 'common', value: 10, image: '🏜️' },
  { name: 'Glock-18 | Sand Dune', rarity: 'common', value: 15, image: '🌵' },
  { name: 'MAC-10 | Fade', rarity: 'common', value: 20, image: '🔫' },
  { name: 'P250 | See Ya Later', rarity: 'common', value: 50, image: '👋' },
  { name: 'MP9 | Bulldozer', rarity: 'common', value: 60, image: '🚜' },
  { name: 'AK-47 | Safari Mesh', rarity: 'rare', value: 100, image: '🌿' },
  { name: 'AK-47 | Redline', rarity: 'rare', value: 150, image: '🔴' },
  { name: 'Glock-18 | Fade', rarity: 'rare', value: 200, image: '💫' },
  { name: 'AWP | Asiimov', rarity: 'rare', value: 250, image: '⚡' },
  { name: 'M4A1-S | Golden Coil', rarity: 'rare', value: 300, image: '🌀' },
  { name: 'USP-S | Kill Confirmed', rarity: 'epic', value: 800, image: '✅' },
  { name: 'Desert Eagle | Blaze', rarity: 'epic', value: 1200, image: '💥' },
  { name: 'Butterfly Knife', rarity: 'epic', value: 1500, image: '🦋' },
  { name: 'Flip Knife | Marble Fade', rarity: 'epic', value: 1600, image: '🎨' },
  { name: 'Bayonet | Tiger Tooth', rarity: 'epic', value: 1800, image: '🐅' },
  { name: 'Karambit | Fade', rarity: 'epic', value: 2000, image: '🗡️' },
  { name: 'Karambit | Doppler', rarity: 'legendary', value: 3000, image: '💠' },
  { name: 'AK-47 | Fire Serpent', rarity: 'legendary', value: 3500, image: '🐍' },
  { name: 'M4A4 | Howl', rarity: 'legendary', value: 4000, image: '🔥' },
  { name: 'AWP | Dragon Lore', rarity: 'legendary', value: 5000, image: '🐉' },
];

const generateCaseDrops = (casePrice: number): Omit<InventoryItem, 'id'>[] => {
  const maxValue = casePrice * 10;
  const minValue = casePrice * 0.1;
  return possibleItems.filter(item => item.value >= minValue && item.value <= maxValue);
};

const cases: CaseItem[] = [
  { id: 0, name: 'Бесплатный', price: 0, rarity: 'common', image: '🎁', drops: possibleItems.filter(i => i.value <= 100) },
  { id: 1, name: 'Новичок', price: 50, rarity: 'common', image: '📦', drops: generateCaseDrops(50) },
  { id: 2, name: 'Starter', price: 100, rarity: 'common', image: '📫', drops: generateCaseDrops(100) },
  { id: 3, name: 'Bronze', price: 200, rarity: 'common', image: '🥉', drops: generateCaseDrops(200) },
  { id: 4, name: 'Silver', price: 300, rarity: 'common', image: '🥈', drops: generateCaseDrops(300) },
  { id: 5, name: 'Gold', price: 450, rarity: 'rare', image: '🥇', drops: generateCaseDrops(450) },
  { id: 6, name: 'Premium', price: 600, rarity: 'rare', image: '💼', drops: generateCaseDrops(600) },
  { id: 7, name: 'VIP', price: 800, rarity: 'rare', image: '👑', drops: generateCaseDrops(800) },
  { id: 8, name: 'Elite', price: 1000, rarity: 'rare', image: '🎀', drops: generateCaseDrops(1000) },
  { id: 9, name: 'Master', price: 1200, rarity: 'epic', image: '⭐', drops: generateCaseDrops(1200) },
  { id: 10, name: 'Champion', price: 1500, rarity: 'epic', image: '🏆', drops: generateCaseDrops(1500) },
  { id: 11, name: 'Legend', price: 1800, rarity: 'epic', image: '🔱', drops: generateCaseDrops(1800) },
  { id: 12, name: 'Mythic', price: 2000, rarity: 'epic', image: '🌟', drops: generateCaseDrops(2000) },
  { id: 13, name: 'Divine', price: 2300, rarity: 'legendary', image: '✨', drops: generateCaseDrops(2300) },
  { id: 14, name: 'Immortal', price: 2600, rarity: 'legendary', image: '💎', drops: generateCaseDrops(2600) },
  { id: 15, name: 'Godlike', price: 3000, rarity: 'legendary', image: '🔮', drops: generateCaseDrops(3000) },
  { id: 16, name: 'Cosmic', price: 3500, rarity: 'legendary', image: '🌌', drops: generateCaseDrops(3500) },
  { id: 17, name: 'Galactic', price: 4000, rarity: 'legendary', image: '🚀', drops: generateCaseDrops(4000) },
  { id: 18, name: 'Supreme', price: 4500, rarity: 'legendary', image: '👁️', drops: generateCaseDrops(4500) },
  { id: 19, name: 'Ultimate', price: 5000, rarity: 'legendary', image: '🎆', drops: generateCaseDrops(5000) },
  { id: 20, name: 'Phantom', price: 5500, rarity: 'legendary', image: '👻', drops: generateCaseDrops(5500) },
  { id: 21, name: 'Shadow', price: 6000, rarity: 'legendary', image: '🌑', drops: generateCaseDrops(6000) },
  { id: 22, name: 'Dragon', price: 7000, rarity: 'legendary', image: '🐲', drops: generateCaseDrops(7000) },
  { id: 23, name: 'Phoenix', price: 8000, rarity: 'legendary', image: '🔥', drops: generateCaseDrops(8000) },
  { id: 24, name: 'Infinity', price: 9000, rarity: 'legendary', image: '♾️', drops: generateCaseDrops(9000) },
  { id: 25, name: 'Universe', price: 10000, rarity: 'legendary', image: '🌠', drops: generateCaseDrops(10000) },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [viewingCase, setViewingCase] = useState<CaseItem | null>(null);
  const [openCount, setOpenCount] = useState(1);
  const [isOpening, setIsOpening] = useState(false);
  const [rouletteItems, setRouletteItems] = useState<InventoryItem[]>([]);
  const [openedItems, setOpenedItems] = useState<InventoryItem[]>([]);
  const [fastMode, setFastMode] = useState(false);
  const [freeTimer, setFreeTimer] = useState(0);
  
  const loadFromStorage = () => {
    const savedStats = localStorage.getItem('cs2_user_stats');
    const savedInventory = localStorage.getItem('cs2_inventory');
    
    return {
      stats: savedStats ? JSON.parse(savedStats) : {
        totalOpened: 0,
        totalSpent: 0,
        totalWon: 0,
        balance: 500,
        level: 1,
        exp: 0,
        lastFreeCase: 0,
      },
      inventory: savedInventory ? JSON.parse(savedInventory) : []
    };
  };

  const [userStats, setUserStats] = useState<UserStats>(loadFromStorage().stats);
  const [inventory, setInventory] = useState<InventoryItem[]>(loadFromStorage().inventory);

  useEffect(() => {
    localStorage.setItem('cs2_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('cs2_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userStats.lastFreeCase) {
        const elapsed = Date.now() - userStats.lastFreeCase;
        const remaining = Math.max(0, 300000 - elapsed);
        setFreeTimer(remaining);
      } else {
        setFreeTimer(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [userStats.lastFreeCase]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const generateRouletteItems = (caseDrops: Omit<InventoryItem, 'id'>[], winningItem: InventoryItem) => {
    const items: InventoryItem[] = [];
    const winPosition = 45;
    
    for (let i = 0; i < 60; i++) {
      if (i === winPosition) {
        items.push(winningItem);
      } else {
        const randomDrop = caseDrops[Math.floor(Math.random() * caseDrops.length)];
        items.push({
          id: Date.now() + i,
          ...randomDrop,
        });
      }
    }
    return items;
  };

  const openCase = (caseItem: CaseItem) => {
    if (caseItem.id === 0) {
      if (freeTimer > 0) return;
      setUserStats({
        ...userStats,
        lastFreeCase: Date.now(),
      });
    } else {
      const totalCost = caseItem.price * openCount;
      if (userStats.balance < totalCost) return;
    }

    setSelectedCase(caseItem);
    setIsOpening(true);
    setOpenedItems([]);

    const newItems: InventoryItem[] = [];
    let totalValue = 0;

    for (let i = 0; i < openCount; i++) {
      const caseDrops = caseItem.drops;
      const rarityRoll = Math.random();
      let selectedItem: Omit<InventoryItem, 'id'>;

      if (rarityRoll < 0.5) {
        const commonItems = caseDrops.filter(item => item.rarity === 'common');
        selectedItem = commonItems[Math.floor(Math.random() * commonItems.length)] || caseDrops[0];
      } else if (rarityRoll < 0.8) {
        const rareItems = caseDrops.filter(item => item.rarity === 'rare');
        selectedItem = rareItems[Math.floor(Math.random() * rareItems.length)] || caseDrops[0];
      } else if (rarityRoll < 0.95) {
        const epicItems = caseDrops.filter(item => item.rarity === 'epic');
        selectedItem = epicItems[Math.floor(Math.random() * epicItems.length)] || caseDrops[0];
      } else {
        const legendaryItems = caseDrops.filter(item => item.rarity === 'legendary');
        selectedItem = legendaryItems[Math.floor(Math.random() * legendaryItems.length)] || caseDrops[0];
      }

      const newItem: InventoryItem = {
        id: Date.now() + i,
        ...selectedItem,
      };
      newItems.push(newItem);
      totalValue += newItem.value;
    }

    if (openCount === 1) {
      const roulette = generateRouletteItems(caseItem.drops, newItems[0]);
      setRouletteItems(roulette);
    }

    const animationDuration = fastMode ? 1000 : 3000;

    setTimeout(() => {
      setOpenedItems(newItems);
      setInventory([...newItems, ...inventory]);
      
      const totalCost = caseItem.id === 0 ? 0 : caseItem.price * openCount;
      const expGain = openCount * 5;
      const newExp = userStats.exp + expGain;
      const levelUp = Math.floor(newExp / 100);
      
      setUserStats({
        ...userStats,
        balance: userStats.balance - totalCost,
        totalOpened: userStats.totalOpened + openCount,
        totalSpent: userStats.totalSpent + totalCost,
        totalWon: userStats.totalWon + totalValue,
        exp: newExp % 100,
        level: userStats.level + levelUp,
      });
      
      setIsOpening(false);
    }, animationDuration);
  };

  const sellItem = (item: InventoryItem) => {
    setInventory(inventory.filter(i => i.id !== item.id));
    setUserStats({
      ...userStats,
      balance: userStats.balance + item.value,
    });
  };

  const closeOpenedModal = () => {
    setOpenedItems([]);
    setSelectedCase(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-3xl">⚡</div>
              <h1 className="text-2xl font-bold neon-glow text-primary">CS2 CASES</h1>
            </div>
            <div className="flex items-center gap-6">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('home')}
                className="hover:text-primary transition-colors"
              >
                <Icon name="Home" className="mr-2" size={18} />
                Главная
              </Button>
              <Button
                variant={activeTab === 'cases' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('cases')}
                className="hover:text-primary transition-colors"
              >
                <Icon name="Package" className="mr-2" size={18} />
                Кейсы
              </Button>
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('profile')}
                className="hover:text-primary transition-colors"
              >
                <Icon name="User" className="mr-2" size={18} />
                Профиль
              </Button>
              <div className="flex items-center gap-3 ml-4 px-4 py-2 bg-card border border-primary/30 rounded-lg">
                <Icon name="Wallet" className="text-primary" size={20} />
                <span className="font-bold text-primary">${userStats.balance}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-12 animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-12 border border-primary/30">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-6xl font-bold mb-4 neon-glow text-primary">
                  ОТКРЫВАЙ КЕЙСЫ
                </h2>
                <p className="text-xl text-foreground/80 mb-6">
                  Получай легендарные скины CS2 из 26 премиум кейсов
                </p>
                <Button
                  size="lg"
                  onClick={() => setActiveTab('cases')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 animate-glow-pulse"
                >
                  Открыть кейс
                  <Icon name="ChevronRight" className="ml-2" size={20} />
                </Button>
              </div>
              <div className="absolute right-12 top-1/2 -translate-y-1/2 text-9xl opacity-20">
                💎
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card border border-primary/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="Package" className="text-primary" size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">{userStats.totalOpened}</div>
                    <div className="text-sm text-foreground/60">Кейсов открыто</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border border-secondary/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Icon name="TrendingUp" className="text-secondary" size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary">${userStats.totalWon}</div>
                    <div className="text-sm text-foreground/60">Всего выиграно</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border border-accent/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Icon name="Award" className="text-accent" size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent">Lvl {userStats.level}</div>
                    <div className="text-sm text-foreground/60">Ваш уровень</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 text-primary neon-glow">Выбери свой кейс</h2>
              <p className="text-foreground/60">26 уникальных кейсов с разными наградами</p>
            </div>

            {isOpening && openCount === 1 && (
              <Card className="p-8 bg-card border-2 border-primary/50 mb-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary mb-4">Открываем кейс...</h3>
                  </div>
                  <div className="relative h-48 overflow-hidden rounded-lg border-2 border-primary/30 bg-background">
                    <div 
                      className="absolute flex gap-4 p-4"
                      style={{
                        animation: `${fastMode ? 'roulette-fast' : 'roulette'} ${fastMode ? '1s' : '3s'} cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards`,
                      }}
                    >
                      {rouletteItems.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex-shrink-0 w-40 h-40 flex flex-col items-center justify-center bg-card border-2 ${rarityBorders[item.rarity]} rounded-lg`}
                        >
                          <div className="text-5xl mb-2">{item.image}</div>
                          <div className={`text-xs font-bold text-center px-2 ${rarityColors[item.rarity]}`}>
                            {item.name}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-accent transform -translate-x-1/2 z-10 shadow-lg shadow-accent/50"></div>
                  </div>
                </div>
              </Card>
            )}

            {isOpening && openCount > 1 && (
              <Card className="p-12 bg-card border-2 border-primary/50 mb-8">
                <div className="text-center space-y-6">
                  <div className="text-7xl animate-bounce">🎰</div>
                  <h3 className="text-3xl font-bold text-primary">Открываем {openCount} кейсов...</h3>
                </div>
              </Card>
            )}

            {openedItems.length > 0 && !isOpening && (
              <Card className="p-12 bg-card border-2 border-primary/50 mb-8 animate-scale-in">
                <div className="text-center space-y-6">
                  <h3 className="text-3xl font-bold text-primary">Поздравляем! Вы получили:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {openedItems.map((item) => (
                      <Card key={item.id} className={`p-6 bg-background border-2 ${rarityBorders[item.rarity]}`}>
                        <Badge className={`mb-3 ${rarityColors[item.rarity]}`}>
                          {item.rarity.toUpperCase()}
                        </Badge>
                        <div className="text-6xl mb-3">{item.image}</div>
                        <h4 className={`font-bold mb-2 ${rarityColors[item.rarity]}`}>{item.name}</h4>
                        <div className="text-2xl font-bold text-primary">${item.value}</div>
                      </Card>
                    ))}
                  </div>
                  <Button
                    size="lg"
                    onClick={closeOpenedModal}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Продолжить
                  </Button>
                </div>
              </Card>
            )}

            <Card className="p-6 bg-card border border-primary/30 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-foreground/80">Открыть сразу:</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((count) => (
                      <Button
                        key={count}
                        variant={openCount === count ? 'default' : 'outline'}
                        onClick={() => setOpenCount(count)}
                        className="w-12 h-12"
                        disabled={isOpening}
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-foreground/80">Быстрый режим:</span>
                  <Button
                    variant={fastMode ? 'default' : 'outline'}
                    onClick={() => setFastMode(!fastMode)}
                    disabled={isOpening}
                  >
                    <Icon name={fastMode ? 'Zap' : 'ZapOff'} className="mr-2" size={18} />
                    {fastMode ? 'Вкл' : 'Выкл'}
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {cases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className={`p-4 bg-card border-2 ${rarityBorders[caseItem.rarity]} hover:scale-105 transition-all ${caseItem.id === 0 ? 'ring-2 ring-accent' : ''}`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">{caseItem.image}</div>
                    <h4 className={`text-sm font-bold ${rarityColors[caseItem.rarity]}`}>
                      {caseItem.name}
                    </h4>
                    {caseItem.id === 0 ? (
                      <div className="text-xs font-bold text-accent">
                        {freeTimer > 0 ? formatTime(freeTimer) : 'ГОТОВ!'}
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-primary">${caseItem.price}</div>
                    )}
                    <div className="flex gap-1">
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90 font-bold text-xs py-2"
                        disabled={isOpening || (caseItem.id === 0 ? freeTimer > 0 : userStats.balance < caseItem.price * openCount)}
                        onClick={() => openCase(caseItem)}
                      >
                        {caseItem.id === 0 ? (
                          freeTimer > 0 ? <Icon name="Clock" size={14} /> : 'Открыть'
                        ) : userStats.balance < caseItem.price * openCount ? (
                          'Недостаточно'
                        ) : (
                          `$${caseItem.price * openCount}`
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2"
                        onClick={() => setViewingCase(caseItem)}
                      >
                        <Icon name="Eye" size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in">
            <Card className="p-8 bg-card border border-primary/30">
              <div className="flex items-start gap-6 mb-8">
                <Avatar className="w-24 h-24 border-2 border-primary">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-3xl bg-primary/20">🎮</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2 text-primary">Player #{Math.floor(Math.random() * 99999)}</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="text-lg px-3 py-1 bg-primary/20 text-primary">
                      Level {userStats.level}
                    </Badge>
                    <span className="text-foreground/60">Баланс: ${userStats.balance}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Опыт до следующего уровня</span>
                      <span className="font-bold text-primary">{userStats.exp}/100 XP</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ width: `${userStats.exp}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="inventory" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="inventory">Инвентарь ({inventory.length})</TabsTrigger>
                  <TabsTrigger value="stats">Статистика</TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary">Предметы: {inventory.length}</h3>
                      <p className="text-sm text-foreground/60">
                        Общая стоимость: ${inventory.reduce((sum, item) => sum + item.value, 0)}
                      </p>
                    </div>
                  </div>

                  {inventory.length === 0 ? (
                    <Card className="p-12 bg-background border border-border/50 text-center">
                      <div className="text-6xl mb-4 opacity-50">📦</div>
                      <p className="text-foreground/60">Ваш инвентарь пуст. Откройте кейсы!</p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {inventory.map((item) => (
                        <Card
                          key={item.id}
                          className={`p-4 bg-background border-2 ${rarityBorders[item.rarity]} hover:scale-105 transition-transform`}
                        >
                          <div className="text-center space-y-2">
                            <div className="text-4xl mb-2">{item.image}</div>
                            <h4 className={`text-sm font-bold ${rarityColors[item.rarity]}`}>{item.name}</h4>
                            <Badge variant="outline" className={`text-xs ${rarityColors[item.rarity]}`}>
                              {item.rarity.toUpperCase()}
                            </Badge>
                            <div className="text-lg font-bold text-primary">${item.value}</div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => sellItem(item)}
                            >
                              <Icon name="DollarSign" className="mr-1" size={14} />
                              Продать
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="stats" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-6 bg-background border border-primary/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="Package" className="text-primary" size={20} />
                        <span className="text-sm text-foreground/60">Открыто кейсов</span>
                      </div>
                      <div className="text-3xl font-bold text-primary">{userStats.totalOpened}</div>
                    </Card>

                    <Card className="p-6 bg-background border border-secondary/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="DollarSign" className="text-secondary" size={20} />
                        <span className="text-sm text-foreground/60">Потрачено</span>
                      </div>
                      <div className="text-3xl font-bold text-secondary">${userStats.totalSpent}</div>
                    </Card>

                    <Card className="p-6 bg-background border border-accent/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="TrendingUp" className="text-accent" size={20} />
                        <span className="text-sm text-foreground/60">Выиграно</span>
                      </div>
                      <div className="text-3xl font-bold text-accent">${userStats.totalWon}</div>
                    </Card>

                    <Card className="p-6 bg-background border border-success/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="Percent" className="text-success" size={20} />
                        <span className="text-sm text-foreground/60">Прибыль</span>
                      </div>
                      <div className="text-3xl font-bold text-success">
                        {userStats.totalSpent > 0 ? 
                          `${((userStats.totalWon - userStats.totalSpent) / userStats.totalSpent * 100).toFixed(1)}%` 
                          : '0%'
                        }
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={!!viewingCase} onOpenChange={() => setViewingCase(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <span className="text-4xl">{viewingCase?.image}</span>
              <span className={rarityColors[viewingCase?.rarity || 'common']}>
                {viewingCase?.name}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-foreground/60 mb-2">Возможные предметы в этом кейсе:</p>
              <p className="text-xl font-bold text-primary">
                {viewingCase?.id === 0 ? 'БЕСПЛАТНО' : `$${viewingCase?.price}`}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {viewingCase?.drops.map((item, idx) => (
                <Card
                  key={idx}
                  className={`p-4 bg-card border-2 ${rarityBorders[item.rarity]}`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl">{item.image}</div>
                    <h4 className={`text-xs font-bold ${rarityColors[item.rarity]}`}>
                      {item.name}
                    </h4>
                    <Badge variant="outline" className={`text-xs ${rarityColors[item.rarity]}`}>
                      {item.rarity}
                    </Badge>
                    <div className="text-sm font-bold text-primary">${item.value}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border/50 mt-16 py-8 bg-card/50">
        <div className="container mx-auto px-4 text-center text-foreground/60">
          <p className="mb-2">© 2025 CS2 CASES. Все права защищены.</p>
          <p className="text-sm">Играйте ответственно. 18+</p>
        </div>
      </footer>

      <style>{`
        @keyframes roulette {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-7920px + 50vw - 88px)); }
        }
        @keyframes roulette-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-7920px + 50vw - 88px)); }
        }
      `}</style>
    </div>
  );
};

export default Index;
