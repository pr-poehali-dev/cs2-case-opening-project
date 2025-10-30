import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
type Category = 'free' | 'starter' | 'bronze' | 'silver' | 'gold' | 'premium' | 'elite' | 'legendary';

interface CaseItem {
  id: number;
  name: string;
  price: number;
  rarity: Rarity;
  category: Category;
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
  { name: 'P250 | Sand Dune', rarity: 'common', value: 10, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'Glock-18 | Sand Dune', rarity: 'common', value: 15, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'MAC-10 | Fade', rarity: 'common', value: 20, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'P250 | See Ya Later', rarity: 'common', value: 50, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'MP9 | Bulldozer', rarity: 'common', value: 60, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'FAMAS | Afterimage', rarity: 'common', value: 70, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'Galil AR | Cerberus', rarity: 'common', value: 80, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'AK-47 | Safari Mesh', rarity: 'rare', value: 100, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'AK-47 | Redline', rarity: 'rare', value: 150, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'M4A4 | Asiimov', rarity: 'rare', value: 180, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'Glock-18 | Fade', rarity: 'rare', value: 200, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'AWP | Asiimov', rarity: 'rare', value: 250, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/bee2adaa-0220-4f0d-879e-77f70dd2f251.jpg' },
  { name: 'M4A1-S | Golden Coil', rarity: 'rare', value: 300, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'AK-47 | Vulcan', rarity: 'rare', value: 350, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'AWP | Hyper Beast', rarity: 'rare', value: 400, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/bee2adaa-0220-4f0d-879e-77f70dd2f251.jpg' },
  { name: 'USP-S | Kill Confirmed', rarity: 'epic', value: 800, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'AK-47 | The Empress', rarity: 'epic', value: 900, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'M4A4 | Neo-Noir', rarity: 'epic', value: 1000, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'AWP | Fade', rarity: 'epic', value: 1100, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/bee2adaa-0220-4f0d-879e-77f70dd2f251.jpg' },
  { name: 'Desert Eagle | Blaze', rarity: 'epic', value: 1200, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'Gut Knife | Doppler', rarity: 'epic', value: 1300, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/eb726648-2c2a-4ef2-a092-b173c696ac64.jpg' },
  { name: 'Butterfly Knife', rarity: 'epic', value: 1500, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/eb726648-2c2a-4ef2-a092-b173c696ac64.jpg' },
  { name: 'Flip Knife | Marble Fade', rarity: 'epic', value: 1600, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/eb726648-2c2a-4ef2-a092-b173c696ac64.jpg' },
  { name: 'Bayonet | Tiger Tooth', rarity: 'epic', value: 1800, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/eb726648-2c2a-4ef2-a092-b173c696ac64.jpg' },
  { name: 'Karambit | Fade', rarity: 'epic', value: 2000, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/eb726648-2c2a-4ef2-a092-b173c696ac64.jpg' },
  { name: 'Karambit | Doppler', rarity: 'legendary', value: 3000, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/eb726648-2c2a-4ef2-a092-b173c696ac64.jpg' },
  { name: 'AK-47 | Fire Serpent', rarity: 'legendary', value: 3500, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'M4A4 | Howl', rarity: 'legendary', value: 4000, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/64b1f221-5639-44ef-b0ef-3d8c0a2e0020.jpg' },
  { name: 'AWP | Dragon Lore', rarity: 'legendary', value: 5000, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/bee2adaa-0220-4f0d-879e-77f70dd2f251.jpg' },
  { name: 'Karambit | Gamma Doppler', rarity: 'legendary', value: 5500, image: 'https://cdn.poehali.dev/projects/9dd3bc49-e53f-4885-a2fd-851a256cbf01/files/eb726648-2c2a-4ef2-a092-b173c696ac64.jpg' },
];

const generateCaseDrops = (casePrice: number): Omit<InventoryItem, 'id'>[] => {
  const maxValue = casePrice * 10;
  const minValue = casePrice * 0.1;
  return possibleItems.filter(item => item.value >= minValue && item.value <= maxValue);
};

const cases: CaseItem[] = [
  { id: 0, name: 'Бесплатный', price: 0, rarity: 'common', category: 'free', image: '🎁', drops: possibleItems.filter(i => i.value <= 100) },
  { id: 1, name: 'Новичок', price: 50, rarity: 'common', category: 'starter', image: '📦', drops: generateCaseDrops(50) },
  { id: 2, name: 'Starter', price: 100, rarity: 'common', category: 'starter', image: '📫', drops: generateCaseDrops(100) },
  { id: 3, name: 'Starter Pro', price: 150, rarity: 'common', category: 'starter', image: '🎯', drops: generateCaseDrops(150) },
  { id: 4, name: 'Bronze', price: 200, rarity: 'common', category: 'bronze', image: '🥉', drops: generateCaseDrops(200) },
  { id: 5, name: 'Bronze+', price: 250, rarity: 'common', category: 'bronze', image: '⚜️', drops: generateCaseDrops(250) },
  { id: 6, name: 'Silver', price: 300, rarity: 'common', category: 'silver', image: '🥈', drops: generateCaseDrops(300) },
  { id: 7, name: 'Silver Elite', price: 350, rarity: 'common', category: 'silver', image: '🎖️', drops: generateCaseDrops(350) },
  { id: 8, name: 'Silver Master', price: 400, rarity: 'common', category: 'silver', image: '🏅', drops: generateCaseDrops(400) },
  { id: 9, name: 'Gold', price: 450, rarity: 'rare', category: 'gold', image: '🥇', drops: generateCaseDrops(450) },
  { id: 10, name: 'Gold Nova', price: 500, rarity: 'rare', category: 'gold', image: '🌟', drops: generateCaseDrops(500) },
  { id: 11, name: 'Gold Master', price: 550, rarity: 'rare', category: 'gold', image: '✨', drops: generateCaseDrops(550) },
  { id: 12, name: 'Premium', price: 600, rarity: 'rare', category: 'premium', image: '💼', drops: generateCaseDrops(600) },
  { id: 13, name: 'Premium+', price: 700, rarity: 'rare', category: 'premium', image: '💎', drops: generateCaseDrops(700) },
  { id: 14, name: 'VIP', price: 800, rarity: 'rare', category: 'premium', image: '👑', drops: generateCaseDrops(800) },
  { id: 15, name: 'VIP Elite', price: 900, rarity: 'rare', category: 'premium', image: '💫', drops: generateCaseDrops(900) },
  { id: 16, name: 'Elite', price: 1000, rarity: 'rare', category: 'elite', image: '🎀', drops: generateCaseDrops(1000) },
  { id: 17, name: 'Elite Master', price: 1100, rarity: 'epic', category: 'elite', image: '⭐', drops: generateCaseDrops(1100) },
  { id: 18, name: 'Master', price: 1200, rarity: 'epic', category: 'elite', image: '🔱', drops: generateCaseDrops(1200) },
  { id: 19, name: 'Master Guardian', price: 1300, rarity: 'epic', category: 'elite', image: '🛡️', drops: generateCaseDrops(1300) },
  { id: 20, name: 'Distinguished', price: 1400, rarity: 'epic', category: 'elite', image: '⚔️', drops: generateCaseDrops(1400) },
  { id: 21, name: 'Champion', price: 1500, rarity: 'epic', category: 'elite', image: '🏆', drops: generateCaseDrops(1500) },
  { id: 22, name: 'Legend', price: 1600, rarity: 'epic', category: 'elite', image: '🎭', drops: generateCaseDrops(1600) },
  { id: 23, name: 'Legend Elite', price: 1700, rarity: 'epic', category: 'elite', image: '🎪', drops: generateCaseDrops(1700) },
  { id: 24, name: 'Mythic', price: 1800, rarity: 'epic', category: 'elite', image: '🔮', drops: generateCaseDrops(1800) },
  { id: 25, name: 'Mythic+', price: 2000, rarity: 'epic', category: 'elite', image: '🌠', drops: generateCaseDrops(2000) },
  { id: 26, name: 'Supreme', price: 2200, rarity: 'legendary', category: 'legendary', image: '👁️', drops: generateCaseDrops(2200) },
  { id: 27, name: 'Divine', price: 2400, rarity: 'legendary', category: 'legendary', image: '🔆', drops: generateCaseDrops(2400) },
  { id: 28, name: 'Immortal', price: 2600, rarity: 'legendary', category: 'legendary', image: '💠', drops: generateCaseDrops(2600) },
  { id: 29, name: 'Immortal Elite', price: 2800, rarity: 'legendary', category: 'legendary', image: '💍', drops: generateCaseDrops(2800) },
  { id: 30, name: 'Godlike', price: 3000, rarity: 'legendary', category: 'legendary', image: '🌌', drops: generateCaseDrops(3000) },
  { id: 31, name: 'Cosmic', price: 3500, rarity: 'legendary', category: 'legendary', image: '🪐', drops: generateCaseDrops(3500) },
  { id: 32, name: 'Galactic', price: 4000, rarity: 'legendary', category: 'legendary', image: '🚀', drops: generateCaseDrops(4000) },
  { id: 33, name: 'Galactic Elite', price: 4500, rarity: 'legendary', category: 'legendary', image: '🌟', drops: generateCaseDrops(4500) },
  { id: 34, name: 'Universal', price: 5000, rarity: 'legendary', category: 'legendary', image: '🎆', drops: generateCaseDrops(5000) },
  { id: 35, name: 'Phantom', price: 5500, rarity: 'legendary', category: 'legendary', image: '👻', drops: generateCaseDrops(5500) },
  { id: 36, name: 'Shadow', price: 6000, rarity: 'legendary', category: 'legendary', image: '🌑', drops: generateCaseDrops(6000) },
  { id: 37, name: 'Dragon', price: 7000, rarity: 'legendary', category: 'legendary', image: '🐲', drops: generateCaseDrops(7000) },
  { id: 38, name: 'Phoenix', price: 8000, rarity: 'legendary', category: 'legendary', image: '🔥', drops: generateCaseDrops(8000) },
  { id: 39, name: 'Infinity', price: 9000, rarity: 'legendary', category: 'legendary', image: '♾️', drops: generateCaseDrops(9000) },
  { id: 40, name: 'Universe', price: 10000, rarity: 'legendary', category: 'legendary', image: '🌈', drops: generateCaseDrops(10000) },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [viewingCase, setViewingCase] = useState<CaseItem | null>(null);
  const [openCount, setOpenCount] = useState(1);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItems, setWonItems] = useState<InventoryItem[]>([]);
  const [openedItems, setOpenedItems] = useState<InventoryItem[]>([]);
  const [fastMode, setFastMode] = useState(false);
  const [freeTimer, setFreeTimer] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [upgradeItem, setUpgradeItem] = useState<InventoryItem | null>(null);
  const [upgradeTarget, setUpgradeTarget] = useState<InventoryItem | null>(null);
  const [upgradeChance, setUpgradeChance] = useState(50);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState<{ success: boolean; item?: InventoryItem } | null>(null);
  const [caseOpenModal, setCaseOpenModal] = useState<CaseItem | null>(null);
  const [modalOpenCount, setModalOpenCount] = useState(1);
  const [modalFastMode, setModalFastMode] = useState(false);
  const [inventorySort, setInventorySort] = useState<'recent' | 'value'>('recent');
  
  const rouletteRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const openCase = (caseItem: CaseItem, count: number, fast: boolean) => {
    if (caseItem.id === 0) {
      if (freeTimer > 0) return;
      setUserStats({
        ...userStats,
        lastFreeCase: Date.now(),
      });
    } else {
      const totalCost = caseItem.price * count;
      if (userStats.balance < totalCost) return;
    }

    setCaseOpenModal(null);
    setSelectedCase(caseItem);
    setIsOpening(true);
    setOpenedItems([]);
    setFastMode(fast);
    setOpenCount(count);

    const newItems: InventoryItem[] = [];
    let totalValue = 0;

    for (let i = 0; i < count; i++) {
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

    setWonItems(newItems);

    const animationDuration = fast ? 1000 : 3000;

    setTimeout(() => {
      setOpenedItems(newItems);
      setInventory([...newItems, ...inventory]);
      
      const totalCost = caseItem.id === 0 ? 0 : caseItem.price * count;
      const expGain = count * 5;
      const newExp = userStats.exp + expGain;
      const levelUp = Math.floor(newExp / 100);
      
      setUserStats({
        ...userStats,
        balance: userStats.balance - totalCost,
        totalOpened: userStats.totalOpened + count,
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

  const performUpgrade = () => {
    if (!upgradeItem || !upgradeTarget) return;

    const cost = Math.round(upgradeItem.value * (1 - upgradeChance / 100));
    if (userStats.balance < cost) return;

    setIsUpgrading(true);

    setTimeout(() => {
      const success = Math.random() * 100 < upgradeChance;

      if (success) {
        const newItem: InventoryItem = {
          ...upgradeTarget,
          id: Date.now(),
        };
        setInventory([newItem, ...inventory.filter(i => i.id !== upgradeItem.id)]);
        setUpgradeResult({ success: true, item: newItem });
      } else {
        setInventory(inventory.filter(i => i.id !== upgradeItem.id));
        setUpgradeResult({ success: false });
      }

      setUserStats({
        ...userStats,
        balance: userStats.balance - cost,
      });

      setIsUpgrading(false);
    }, 2000);
  };

  const closeOpenedModal = () => {
    setOpenedItems([]);
    setSelectedCase(null);
    setWonItems([]);
  };

  const filteredCases = categoryFilter === 'all' ? cases : cases.filter(c => c.category === categoryFilter);

  const getPossibleUpgrades = (item: InventoryItem) => {
    return possibleItems.filter(i => i.value > item.value && i.value <= item.value * 3);
  };

  const calculateUpgradeCost = () => {
    if (!upgradeItem) return 0;
    return Math.round(upgradeItem.value * (1 - upgradeChance / 100));
  };

  const sortedInventory = [...inventory].sort((a, b) => {
    if (inventorySort === 'value') {
      return b.value - a.value;
    }
    return b.id - a.id;
  });

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
                  Получай легендарные скины CS2 из 41 премиум кейса
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
              <p className="text-foreground/60">41 уникальный кейс в 8 категориях</p>
            </div>

            {isOpening && selectedCase && (
              <div className="space-y-4">
                {wonItems.map((wonItem, idx) => (
                  <Card key={idx} className="p-6 bg-card border-2 border-primary/50 relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-primary">Кейс #{idx + 1}</h3>
                      </div>
                      <div className="relative h-32 overflow-hidden rounded-lg border-2 border-primary/30 bg-background">
                        <div 
                          ref={el => rouletteRefs.current[idx] = el}
                          className="absolute flex gap-2 p-2 roulette-animation"
                          style={{
                            animation: `${fastMode ? 'roulette-fast' : 'roulette'} ${fastMode ? '1s' : '3s'} cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards`,
                          }}
                        >
                          {Array.from({ length: 50 }).map((_, i) => {
                            let item;
                            if (i === 45) {
                              item = wonItem;
                            } else {
                              const randomDrop = selectedCase.drops[Math.floor(Math.random() * selectedCase.drops.length)];
                              item = { ...randomDrop, id: Date.now() + i };
                            }
                            return (
                              <div
                                key={i}
                                className={`flex-shrink-0 w-28 h-28 flex flex-col items-center justify-center bg-card border-2 ${rarityBorders[item.rarity]} rounded-lg p-2`}
                              >
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain mb-1" />
                                <div className={`text-[10px] font-bold text-center ${rarityColors[item.rarity]}`}>
                                  {item.name}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-accent transform -translate-x-1/2 z-10 shadow-lg shadow-accent/50"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {openedItems.length > 0 && !isOpening && (
              <Card className="p-12 bg-card border-2 border-primary/50 mb-8 animate-scale-in">
                <div className="text-center space-y-6">
                  <h3 className="text-3xl font-bold text-primary">Поздравляем! Вы получили:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {openedItems.map((item) => (
                      <Card key={item.id} className={`p-6 bg-background border-2 ${rarityBorders[item.rarity]}`}>
                        <Badge className={`mb-3 ${rarityColors[item.rarity]}`}>
                          {item.rarity.toUpperCase()}
                        </Badge>
                        <img src={item.image} alt={item.name} className="w-32 h-32 object-contain mx-auto mb-3" />
                        <h4 className={`font-bold mb-2 text-sm ${rarityColors[item.rarity]}`}>{item.name}</h4>
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

            <div className="flex gap-2 mb-4 flex-wrap">
              <Button
                variant={categoryFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setCategoryFilter('all')}
                size="sm"
              >
                Все
              </Button>
              {(['free', 'starter', 'bronze', 'silver', 'gold', 'premium', 'elite', 'legendary'] as Category[]).map((cat) => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? 'default' : 'outline'}
                  onClick={() => setCategoryFilter(cat)}
                  size="sm"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredCases.map((caseItem) => (
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
                        disabled={isOpening || (caseItem.id === 0 ? freeTimer > 0 : userStats.balance < caseItem.price)}
                        onClick={() => setCaseOpenModal(caseItem)}
                      >
                        {caseItem.id === 0 ? (
                          freeTimer > 0 ? <Icon name="Clock" size={14} /> : 'Открыть'
                        ) : userStats.balance < caseItem.price ? (
                          'Мало $'
                        ) : (
                          'Открыть'
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

        {activeTab === 'upgrade' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 text-secondary neon-glow">Апгрейд предметов</h2>
              <p className="text-foreground/60">Улучшай свои скины с настраиваемым шансом успеха</p>
            </div>

            {upgradeResult && (
              <Card className="p-8 bg-card border-2 border-primary/50 mb-8 animate-scale-in">
                <div className="text-center space-y-4">
                  {upgradeResult.success ? (
                    <>
                      <div className="text-6xl">🎉</div>
                      <h3 className="text-2xl font-bold text-success">Успешный апгрейд!</h3>
                      <Card className={`p-6 bg-background border-2 ${rarityBorders[upgradeResult.item!.rarity]} inline-block`}>
                        <img src={upgradeResult.item!.image} alt={upgradeResult.item!.name} className="w-32 h-32 object-contain mx-auto mb-2" />
                        <h4 className={`font-bold ${rarityColors[upgradeResult.item!.rarity]}`}>{upgradeResult.item!.name}</h4>
                        <div className="text-xl font-bold text-primary">${upgradeResult.item!.value}</div>
                      </Card>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl">💔</div>
                      <h3 className="text-2xl font-bold text-destructive">Неудача</h3>
                      <p className="text-foreground/60">Предмет потерян. Попробуйте еще раз!</p>
                    </>
                  )}
                  <Button onClick={() => {
                    setUpgradeResult(null);
                    setUpgradeItem(null);
                    setUpgradeTarget(null);
                  }}>
                    Продолжить
                  </Button>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 bg-card border border-primary/30">
                <h3 className="text-xl font-bold mb-4 text-primary">1. Выбери предмет</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {inventory.length === 0 ? (
                    <p className="text-foreground/60 text-center py-8">Инвентарь пуст</p>
                  ) : (
                    inventory.map((item) => (
                      <Card
                        key={item.id}
                        className={`p-3 bg-background border-2 ${upgradeItem?.id === item.id ? 'border-primary' : rarityBorders[item.rarity]} hover:scale-102 transition-transform cursor-pointer`}
                        onClick={() => {
                          setUpgradeItem(item);
                          setUpgradeTarget(null);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                          <div className="flex-1">
                            <h4 className={`text-sm font-bold ${rarityColors[item.rarity]}`}>{item.name}</h4>
                            <p className="text-xs text-foreground/60">${item.value}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>

              <Card className="p-6 bg-card border border-secondary/30">
                <h3 className="text-xl font-bold mb-4 text-secondary">2. Целевой предмет</h3>
                {!upgradeItem ? (
                  <p className="text-foreground/60 text-center py-8">Сначала выберите предмет для апгрейда</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getPossibleUpgrades(upgradeItem).map((item, idx) => (
                      <Card
                        key={idx}
                        className={`p-3 bg-background border-2 ${upgradeTarget?.name === item.name ? 'border-secondary' : rarityBorders[item.rarity]} hover:scale-102 transition-transform cursor-pointer`}
                        onClick={() => setUpgradeTarget({ ...item, id: Date.now() })}
                      >
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                          <div className="flex-1">
                            <h4 className={`text-sm font-bold ${rarityColors[item.rarity]}`}>{item.name}</h4>
                            <p className="text-xs text-foreground/60">${item.value}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6 bg-card border border-accent/30">
                <h3 className="text-xl font-bold mb-4 text-accent">3. Настройки</h3>
                {!upgradeItem || !upgradeTarget ? (
                  <p className="text-foreground/60 text-center py-8">Выберите предметы для апгрейда</p>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-foreground/80 mb-2 block">
                        Шанс успеха: {upgradeChance}%
                      </label>
                      <Slider
                        value={[upgradeChance]}
                        onValueChange={(v) => setUpgradeChance(v[0])}
                        min={5}
                        max={95}
                        step={5}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-foreground/60">
                        <span>5%</span>
                        <span>95%</span>
                      </div>
                    </div>

                    <div className="space-y-2 p-4 bg-background rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground/60">Стоимость:</span>
                        <span className="font-bold text-primary">${calculateUpgradeCost()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground/60">При успехе:</span>
                        <span className="font-bold text-success">+${upgradeTarget.value - upgradeItem.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground/60">При провале:</span>
                        <span className="font-bold text-destructive">-${upgradeItem.value}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-secondary hover:bg-secondary/90 font-bold"
                      onClick={performUpgrade}
                      disabled={isUpgrading || userStats.balance < calculateUpgradeCost()}
                    >
                      {isUpgrading ? (
                        <>
                          <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                          Апгрейд...
                        </>
                      ) : userStats.balance < calculateUpgradeCost() ? (
                        'Недостаточно средств'
                      ) : (
                        `Улучшить за $${calculateUpgradeCost()}`
                      )}
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            <Card className="p-6 bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/30">
              <div className="flex items-start gap-4">
                <Icon name="Info" className="text-secondary mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-secondary mb-2">Как работает апгрейд?</h4>
                  <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
                    <li>Выберите предмет из инвентаря и целевой предмет для апгрейда</li>
                    <li>Настройте шанс успеха (чем выше шанс, тем выше стоимость)</li>
                    <li>При успехе получите целевой предмет, при неудаче потеряете исходный</li>
                    <li>Целевой предмет может стоить до 3x от исходного</li>
                  </ul>
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
                    <div className="flex gap-2">
                      <Button
                        variant={inventorySort === 'recent' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setInventorySort('recent')}
                      >
                        Последние
                      </Button>
                      <Button
                        variant={inventorySort === 'value' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setInventorySort('value')}
                      >
                        По цене
                      </Button>
                    </div>
                  </div>

                  {inventory.length === 0 ? (
                    <Card className="p-12 bg-background border border-border/50 text-center">
                      <div className="text-6xl mb-4 opacity-50">📦</div>
                      <p className="text-foreground/60">Ваш инвентарь пуст. Откройте кейсы!</p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {sortedInventory.map((item) => (
                        <Card
                          key={item.id}
                          className={`p-4 bg-background border-2 ${rarityBorders[item.rarity]} hover:scale-105 transition-transform`}
                        >
                          <div className="text-center space-y-2">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-contain mx-auto mb-2" />
                            <h4 className={`text-xs font-bold ${rarityColors[item.rarity]}`}>{item.name}</h4>
                            <Badge variant="outline" className={`text-xs ${rarityColors[item.rarity]}`}>
                              {item.rarity.toUpperCase()}
                            </Badge>
                            <div className="text-sm font-bold text-primary">${item.value}</div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => sellItem(item)}
                            >
                              <Icon name="DollarSign" className="mr-1" size={12} />
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

      <Dialog open={!!caseOpenModal} onOpenChange={() => setCaseOpenModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <span className="text-4xl">{caseOpenModal?.image}</span>
              <span className={rarityColors[caseOpenModal?.rarity || 'common']}>
                {caseOpenModal?.name}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center py-4">
              <p className="text-foreground/60 mb-2">Настройки открытия</p>
              {caseOpenModal?.id === 0 ? (
                <p className="text-2xl font-bold text-accent">БЕСПЛАТНО</p>
              ) : (
                <p className="text-2xl font-bold text-primary">${caseOpenModal?.price}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-foreground/80 mb-3 block font-bold">
                Количество кейсов
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((count) => (
                  <Button
                    key={count}
                    variant={modalOpenCount === count ? 'default' : 'outline'}
                    onClick={() => setModalOpenCount(count)}
                    className="w-14 h-14 text-lg font-bold"
                  >
                    {count}
                  </Button>
                ))}
              </div>
              {caseOpenModal && caseOpenModal.id !== 0 && (
                <p className="text-center mt-3 text-sm">
                  Итого: <span className="font-bold text-primary">${(caseOpenModal.price * modalOpenCount)}</span>
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-foreground/80 mb-3 block font-bold">
                Режим открытия
              </label>
              <div className="flex gap-2">
                <Button
                  variant={!modalFastMode ? 'default' : 'outline'}
                  onClick={() => setModalFastMode(false)}
                  className="flex-1"
                >
                  <Icon name="Clock" className="mr-2" size={18} />
                  Обычный (3s)
                </Button>
                <Button
                  variant={modalFastMode ? 'default' : 'outline'}
                  onClick={() => setModalFastMode(true)}
                  className="flex-1"
                >
                  <Icon name="Zap" className="mr-2" size={18} />
                  Быстрый (1s)
                </Button>
              </div>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 font-bold text-lg py-6"
              disabled={caseOpenModal && caseOpenModal.id !== 0 && userStats.balance < (caseOpenModal.price * modalOpenCount)}
              onClick={() => {
                if (caseOpenModal) {
                  openCase(caseOpenModal, modalOpenCount, modalFastMode);
                }
              }}
            >
              {caseOpenModal && caseOpenModal.id !== 0 && userStats.balance < (caseOpenModal.price * modalOpenCount) ? (
                'Недостаточно средств'
              ) : (
                'Открыть!'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingCase} onOpenChange={() => setViewingCase(null)}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {viewingCase?.drops.map((item, idx) => (
                <Card
                  key={idx}
                  className={`p-3 bg-card border-2 ${rarityBorders[item.rarity]}`}
                >
                  <div className="text-center space-y-2">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain mx-auto" />
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
          100% { transform: translateX(calc(-5400px + 50% - 56px)); }
        }
        @keyframes roulette-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-5400px + 50% - 56px)); }
        }
        .roulette-animation {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default Index;
