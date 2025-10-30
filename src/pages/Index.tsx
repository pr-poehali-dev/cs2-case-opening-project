import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface CaseItem {
  id: number;
  name: string;
  price: number;
  rarity: Rarity;
  image: string;
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

const cases: CaseItem[] = [
  { id: 1, name: 'Starter Case', price: 100, rarity: 'common', image: '🎁' },
  { id: 2, name: 'Premium Case', price: 500, rarity: 'rare', image: '📦' },
  { id: 3, name: 'Elite Case', price: 1000, rarity: 'epic', image: '🎀' },
  { id: 4, name: 'Legendary Case', price: 2500, rarity: 'legendary', image: '💎' },
];

const possibleItems: Omit<InventoryItem, 'id'>[] = [
  { name: 'AK-47 | Redline', rarity: 'rare', value: 150, image: '🔫' },
  { name: 'AWP | Dragon Lore', rarity: 'legendary', value: 5000, image: '🎯' },
  { name: 'M4A4 | Howl', rarity: 'legendary', value: 4000, image: '🔥' },
  { name: 'Karambit | Fade', rarity: 'epic', value: 2000, image: '🗡️' },
  { name: 'Butterfly Knife', rarity: 'epic', value: 1500, image: '🦋' },
  { name: 'Glock-18 | Fade', rarity: 'rare', value: 200, image: '💫' },
  { name: 'P250 | See Ya Later', rarity: 'common', value: 50, image: '👋' },
  { name: 'USP-S | Kill Confirmed', rarity: 'epic', value: 800, image: '✅' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [userStats, setUserStats] = useState<UserStats>({
    totalOpened: 47,
    totalSpent: 12500,
    totalWon: 15800,
    balance: 5000,
    level: 12,
    exp: 65,
  });
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, ...possibleItems[0] },
    { id: 2, ...possibleItems[3] },
    { id: 3, ...possibleItems[5] },
  ]);
  const [isOpening, setIsOpening] = useState(false);
  const [openedItem, setOpenedItem] = useState<InventoryItem | null>(null);

  const openCase = (caseItem: CaseItem) => {
    if (userStats.balance < caseItem.price) return;

    setIsOpening(true);
    setOpenedItem(null);

    setTimeout(() => {
      const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
      const newItem: InventoryItem = {
        id: Date.now(),
        ...randomItem,
      };

      setOpenedItem(newItem);
      setInventory([newItem, ...inventory]);
      setUserStats({
        ...userStats,
        balance: userStats.balance - caseItem.price,
        totalOpened: userStats.totalOpened + 1,
        totalSpent: userStats.totalSpent + caseItem.price,
        totalWon: userStats.totalWon + newItem.value,
        exp: Math.min(100, userStats.exp + 5),
      });
      setIsOpening(false);
    }, 3000);
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
                variant={activeTab === 'upgrade' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('upgrade')}
                className="hover:text-primary transition-colors"
              >
                <Icon name="TrendingUp" className="mr-2" size={18} />
                Апгрейды
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
                  Получай легендарные скины CS2 из премиум кейсов
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

            <div>
              <h3 className="text-3xl font-bold mb-6 text-primary">Популярные кейсы</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cases.map((caseItem) => (
                  <Card
                    key={caseItem.id}
                    className={`p-6 bg-card border-2 ${rarityBorders[caseItem.rarity]} hover:scale-105 transition-transform cursor-pointer group`}
                    onClick={() => setActiveTab('cases')}
                  >
                    <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                      {caseItem.image}
                    </div>
                    <h4 className={`text-xl font-bold text-center mb-2 ${rarityColors[caseItem.rarity]}`}>
                      {caseItem.name}
                    </h4>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-primary">${caseItem.price}</span>
                    </div>
                  </Card>
                ))}
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
              <p className="text-foreground/60">Открывай кейсы и получай легендарные предметы</p>
            </div>

            {isOpening && (
              <Card className="p-12 bg-card border-2 border-primary/50 mb-8">
                <div className="text-center space-y-6">
                  <div className="text-7xl animate-bounce">🎰</div>
                  <h3 className="text-3xl font-bold text-primary">Открываем кейс...</h3>
                  <Progress value={66} className="w-full max-w-md mx-auto" />
                </div>
              </Card>
            )}

            {openedItem && !isOpening && (
              <Card className={`p-12 bg-card border-2 ${rarityBorders[openedItem.rarity]} mb-8 animate-scale-in`}>
                <div className="text-center space-y-6">
                  <Badge className={`text-lg px-4 py-1 ${rarityColors[openedItem.rarity]}`}>
                    {openedItem.rarity.toUpperCase()}
                  </Badge>
                  <div className="text-8xl">{openedItem.image}</div>
                  <h3 className={`text-4xl font-bold ${rarityColors[openedItem.rarity]} neon-glow`}>
                    {openedItem.name}
                  </h3>
                  <div className="text-3xl font-bold text-primary">${openedItem.value}</div>
                  <Button
                    size="lg"
                    onClick={() => setOpenedItem(null)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Продолжить
                  </Button>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className={`p-8 bg-card border-2 ${rarityBorders[caseItem.rarity]} hover:scale-105 transition-all`}
                >
                  <div className="text-center space-y-4">
                    <div className="text-7xl mb-4">{caseItem.image}</div>
                    <h4 className={`text-2xl font-bold ${rarityColors[caseItem.rarity]}`}>
                      {caseItem.name}
                    </h4>
                    <Badge variant="outline" className={rarityColors[caseItem.rarity]}>
                      {caseItem.rarity.toUpperCase()}
                    </Badge>
                    <div className="text-3xl font-bold text-primary">${caseItem.price}</div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 font-bold"
                      onClick={() => openCase(caseItem)}
                      disabled={isOpening || userStats.balance < caseItem.price}
                    >
                      {userStats.balance < caseItem.price ? 'Недостаточно средств' : 'Открыть'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upgrade' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 text-secondary neon-glow">Апгрейд предметов</h2>
              <p className="text-foreground/60">Улучшай свои предметы для получения более редких</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-8 bg-card border border-primary/30">
                <h3 className="text-2xl font-bold mb-6 text-primary">Выбери предмет</h3>
                <div className="space-y-4">
                  {inventory.slice(0, 5).map((item) => (
                    <Card
                      key={item.id}
                      className={`p-4 bg-background border ${rarityBorders[item.rarity]} hover:scale-102 transition-transform cursor-pointer`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{item.image}</div>
                        <div className="flex-1">
                          <h4 className={`font-bold ${rarityColors[item.rarity]}`}>{item.name}</h4>
                          <p className="text-sm text-foreground/60">${item.value}</p>
                        </div>
                        <Icon name="ChevronRight" className="text-foreground/40" />
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              <Card className="p-8 bg-card border border-secondary/30">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Результат апгрейда</h3>
                <div className="text-center space-y-6 py-12">
                  <div className="text-7xl opacity-50">❓</div>
                  <p className="text-foreground/60">Выберите предмет для апгрейда</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Шанс успеха:</span>
                      <span className="text-primary font-bold">45%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Стоимость:</span>
                      <span className="text-primary font-bold">$200</span>
                    </div>
                  </div>
                  <Button className="w-full bg-secondary hover:bg-secondary/90" disabled>
                    Улучшить предмет
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/30">
              <div className="flex items-start gap-4">
                <Icon name="Info" className="text-secondary mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-secondary mb-2">Как работает апгрейд?</h4>
                  <p className="text-sm text-foreground/70">
                    Выберите предмет из инвентаря и попробуйте улучшить его до более редкого уровня.
                    Шанс успеха зависит от редкости предмета. При неудаче предмет теряется.
                  </p>
                </div>
              </div>
            </Card>
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
                  <h2 className="text-3xl font-bold mb-2 text-primary">Player #12345</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="text-lg px-3 py-1 bg-primary/20 text-primary">
                      Level {userStats.level}
                    </Badge>
                    <span className="text-foreground/60">Участник с января 2025</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Опыт до следующего уровня</span>
                      <span className="font-bold text-primary">{userStats.exp}/100 XP</span>
                    </div>
                    <Progress value={userStats.exp} className="h-2" />
                  </div>
                </div>
              </div>

              <Tabs defaultValue="stats" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="stats">Статистика</TabsTrigger>
                  <TabsTrigger value="inventory">Инвентарь</TabsTrigger>
                </TabsList>

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
                        +{Math.round(((userStats.totalWon - userStats.totalSpent) / userStats.totalSpent) * 100)}%
                      </div>
                    </Card>
                  </div>

                  <Card className="p-6 bg-background border border-border/50">
                    <h3 className="text-xl font-bold mb-4 text-primary">Последние открытия</h3>
                    <div className="space-y-3">
                      {inventory.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{item.image}</div>
                            <div>
                              <div className={`font-bold ${rarityColors[item.rarity]}`}>{item.name}</div>
                              <div className="text-sm text-foreground/60">
                                {new Date().toLocaleDateString('ru-RU')}
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-primary">${item.value}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary">Предметы: {inventory.length}</h3>
                      <p className="text-sm text-foreground/60">
                        Общая стоимость: $
                        {inventory.reduce((sum, item) => sum + item.value, 0)}
                      </p>
                    </div>
                    <Button variant="outline" className="border-primary/30">
                      <Icon name="SlidersHorizontal" className="mr-2" size={18} />
                      Фильтры
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inventory.map((item) => (
                      <Card
                        key={item.id}
                        className={`p-6 bg-background border-2 ${rarityBorders[item.rarity]} hover:scale-105 transition-transform`}
                      >
                        <div className="text-center space-y-3">
                          <div className="text-5xl mb-2">{item.image}</div>
                          <h4 className={`font-bold ${rarityColors[item.rarity]}`}>{item.name}</h4>
                          <Badge variant="outline" className={rarityColors[item.rarity]}>
                            {item.rarity.toUpperCase()}
                          </Badge>
                          <div className="text-2xl font-bold text-primary">${item.value}</div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              Продать
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Улучшить
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 mt-16 py-8 bg-card/50">
        <div className="container mx-auto px-4 text-center text-foreground/60">
          <p className="mb-2">© 2025 CS2 CASES. Все права защищены.</p>
          <p className="text-sm">Играйте ответственно. 18+</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
