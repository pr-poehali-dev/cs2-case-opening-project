import { useState, useEffect } from 'react';
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
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
};

const rarityBg: Record<Rarity, string> = {
  common: 'bg-gray-500/20',
  rare: 'bg-blue-500/20',
  epic: 'bg-purple-500/20',
  legendary: 'bg-yellow-500/20',
};

const rarityBorders: Record<Rarity, string> = {
  common: 'border-gray-500/50',
  rare: 'border-blue-500/50',
  epic: 'border-purple-500/50',
  legendary: 'border-yellow-500/50',
};

const rarityGlow: Record<Rarity, string> = {
  common: 'shadow-gray-500/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/50',
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
  const [activeTab, setActiveTab] = useState('cases');
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [viewingCase, setViewingCase] = useState<CaseItem | null>(null);
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
  const [inventorySort, setInventorySort] = useState<'recent' | 'value'>('value');
  
  const loadFromStorage = () => {
    const savedStats = localStorage.getItem('cs2_user_stats');
    const savedInventory = localStorage.getItem('cs2_inventory');
    
    return {
      stats: savedStats ? JSON.parse(savedStats) : {
        totalOpened: 0,
        totalSpent: 0,
        totalWon: 0,
        balance: 1000,
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

    const animationDuration = fast ? 1500 : 4000;

    setTimeout(() => {
      setOpenedItems(newItems);
      setInventory([...newItems, ...inventory]);
      
      const totalCost = caseItem.id === 0 ? 0 : caseItem.price * count;
      const expGain = count * 10;
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

    const cost = Math.round((upgradeTarget.value - upgradeItem.value) * (upgradeChance / 100));
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
    }, 2500);
  };

  const closeOpenedModal = () => {
    setOpenedItems([]);
    setSelectedCase(null);
    setWonItems([]);
  };

  const filteredCases = categoryFilter === 'all' ? cases : cases.filter(c => c.category === categoryFilter);

  const getPossibleUpgrades = (item: InventoryItem) => {
    return possibleItems.filter(i => i.value > item.value && i.value <= item.value * 5);
  };

  const calculateUpgradeCost = () => {
    if (!upgradeItem || !upgradeTarget) return 0;
    return Math.round((upgradeTarget.value - upgradeItem.value) * (upgradeChance / 100));
  };

  const sortedInventory = [...inventory].sort((a, b) => {
    if (inventorySort === 'value') {
      return b.value - a.value;
    }
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-blue-500/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">💎</div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CS2 CASES
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant={activeTab === 'cases' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('cases')}
                className="font-bold"
              >
                <Icon name="Package" className="mr-2" size={18} />
                Кейсы
              </Button>
              <Button
                variant={activeTab === 'upgrade' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('upgrade')}
                className="font-bold"
              >
                <Icon name="TrendingUp" className="mr-2" size={18} />
                Апгрейд
              </Button>
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('profile')}
                className="font-bold"
              >
                <Icon name="User" className="mr-2" size={18} />
                Профиль
              </Button>
              <div className="flex items-center gap-3 ml-4 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/50 rounded-xl shadow-lg shadow-yellow-500/20">
                <Icon name="Coins" className="text-yellow-400" size={24} />
                <span className="text-2xl font-black text-yellow-400">${userStats.balance}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'cases' && (
          <div className="space-y-8">
            {isOpening && selectedCase && (
              <div className="space-y-6">
                {wonItems.map((wonItem, idx) => {
                  const ITEM_WIDTH = 140;
                  const ITEM_GAP = 12;
                  const WIN_POSITION = 15;
                  const TOTAL_ITEMS = 80;
                  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
                  const offset = -(WIN_POSITION * (ITEM_WIDTH + ITEM_GAP)) + (viewportWidth / 2 - ITEM_WIDTH / 2);

                  return (
                    <Card key={idx} className="p-8 bg-slate-900/50 border-2 border-blue-500/30 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-blue-500/10">
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Открытие кейса #{idx + 1}
                          </h3>
                        </div>
                        <div className="relative h-44 overflow-hidden rounded-2xl border-2 border-blue-500/50 bg-slate-950/80 shadow-inner">
                          <div 
                            className="absolute flex gap-3 p-4"
                            style={{
                              animation: `roulette-slide-${idx} ${fastMode ? '1.5s' : '4s'} cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                              transform: `translateX(0px)`,
                            }}
                          >
                            {Array.from({ length: TOTAL_ITEMS }).map((_, i) => {
                              let item;
                              if (i === WIN_POSITION) {
                                item = wonItem;
                              } else {
                                const randomDrop = selectedCase.drops[Math.floor(Math.random() * selectedCase.drops.length)];
                                item = { ...randomDrop, id: Date.now() + i + idx * 1000 };
                              }
                              return (
                                <div
                                  key={i}
                                  className={`flex-shrink-0 w-[140px] h-36 flex flex-col items-center justify-center ${rarityBg[item.rarity]} border-2 ${rarityBorders[item.rarity]} rounded-xl p-3 backdrop-blur-sm shadow-lg ${rarityGlow[item.rarity]}`}
                                >
                                  <img src={item.image} alt={item.name} className="w-20 h-20 object-contain mb-2" />
                                  <div className={`text-xs font-bold text-center ${rarityColors[item.rarity]} line-clamp-2`}>
                                    {item.name}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400 transform -translate-x-1/2 z-10 shadow-2xl shadow-yellow-500/80"></div>
                          <div className="absolute left-1/2 top-0 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400 transform -translate-x-1/2 z-10 drop-shadow-lg"></div>
                          <div className="absolute left-1/2 bottom-0 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-yellow-400 transform -translate-x-1/2 z-10 drop-shadow-lg"></div>
                        </div>
                      </div>
                      <style>{`
                        @keyframes roulette-slide-${idx} {
                          0% { transform: translateX(0); }
                          100% { transform: translateX(${offset}px); }
                        }
                      `}</style>
                    </Card>
                  );
                })}
              </div>
            )}

            {openedItems.length > 0 && !isOpening && (
              <Card className="p-16 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-yellow-500/50 mb-8 backdrop-blur-xl shadow-2xl shadow-yellow-500/20">
                <div className="text-center space-y-8">
                  <div>
                    <div className="text-7xl mb-4 animate-bounce">🎉</div>
                    <h3 className="text-4xl font-black mb-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                      Поздравляем!
                    </h3>
                    <p className="text-xl text-slate-400">Вы получили следующие предметы:</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {openedItems.map((item) => (
                      <Card key={item.id} className={`p-6 ${rarityBg[item.rarity]} border-2 ${rarityBorders[item.rarity]} backdrop-blur-sm hover:scale-105 transition-transform shadow-xl ${rarityGlow[item.rarity]}`}>
                        <Badge className={`mb-4 ${rarityColors[item.rarity]} font-bold text-xs`}>
                          {item.rarity.toUpperCase()}
                        </Badge>
                        <img src={item.image} alt={item.name} className="w-32 h-32 object-contain mx-auto mb-4" />
                        <h4 className={`font-bold mb-3 ${rarityColors[item.rarity]}`}>{item.name}</h4>
                        <div className="text-3xl font-black text-yellow-400">${item.value}</div>
                      </Card>
                    ))}
                  </div>
                  <Button
                    size="lg"
                    onClick={closeOpenedModal}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-lg px-12 py-6 shadow-xl shadow-blue-500/30"
                  >
                    Продолжить
                  </Button>
                </div>
              </Card>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={categoryFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setCategoryFilter('all')}
                className="font-bold"
              >
                Все кейсы
              </Button>
              {(['free', 'starter', 'bronze', 'silver', 'gold', 'premium', 'elite', 'legendary'] as Category[]).map((cat) => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? 'default' : 'outline'}
                  onClick={() => setCategoryFilter(cat)}
                  className="font-bold"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {filteredCases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className={`p-6 ${rarityBg[caseItem.rarity]} border-2 ${rarityBorders[caseItem.rarity]} hover:scale-105 hover:shadow-2xl transition-all backdrop-blur-sm cursor-pointer ${rarityGlow[caseItem.rarity]}`}
                  onClick={() => !isOpening && (caseItem.id === 0 && freeTimer > 0 ? null : setCaseOpenModal(caseItem))}
                >
                  <div className="text-center space-y-3">
                    <div className="text-5xl mb-3">{caseItem.image}</div>
                    <h4 className={`text-base font-black ${rarityColors[caseItem.rarity]}`}>
                      {caseItem.name}
                    </h4>
                    {caseItem.id === 0 ? (
                      <div className="text-sm font-bold text-green-400">
                        {freeTimer > 0 ? formatTime(freeTimer) : '✅ ГОТОВ!'}
                      </div>
                    ) : (
                      <div className="text-2xl font-black text-yellow-400">${caseItem.price}</div>
                    )}
                    <Button
                      className={`w-full font-bold ${caseItem.id === 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} shadow-lg`}
                      disabled={isOpening || (caseItem.id === 0 ? freeTimer > 0 : false)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!(caseItem.id === 0 && freeTimer > 0)) {
                          setCaseOpenModal(caseItem);
                        }
                      }}
                    >
                      {caseItem.id === 0 && freeTimer > 0 ? (
                        <Icon name="Clock" size={16} />
                      ) : (
                        'Открыть'
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upgrade' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-5xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Улучшение предметов
              </h2>
              <p className="text-xl text-slate-400">Рискни и получи предмет в 5 раз дороже!</p>
            </div>

            {upgradeResult && (
              <Card className="p-12 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-purple-500/50 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
                <div className="text-center space-y-6">
                  {upgradeResult.success ? (
                    <>
                      <div className="text-8xl animate-bounce">🎊</div>
                      <h3 className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        УСПЕХ!
                      </h3>
                      <Card className={`p-8 ${rarityBg[upgradeResult.item!.rarity]} border-2 ${rarityBorders[upgradeResult.item!.rarity]} inline-block backdrop-blur-sm shadow-2xl ${rarityGlow[upgradeResult.item!.rarity]}`}>
                        <img src={upgradeResult.item!.image} alt={upgradeResult.item!.name} className="w-40 h-40 object-contain mx-auto mb-4" />
                        <h4 className={`text-xl font-bold ${rarityColors[upgradeResult.item!.rarity]} mb-2`}>{upgradeResult.item!.name}</h4>
                        <div className="text-4xl font-black text-yellow-400">${upgradeResult.item!.value}</div>
                      </Card>
                    </>
                  ) : (
                    <>
                      <div className="text-8xl">😢</div>
                      <h3 className="text-4xl font-black text-red-400">Неудача!</h3>
                      <p className="text-xl text-slate-400">Предмет потерян. Попробуй снова!</p>
                    </>
                  )}
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold text-lg px-12 py-6"
                    onClick={() => {
                      setUpgradeResult(null);
                      setUpgradeItem(null);
                      setUpgradeTarget(null);
                    }}
                  >
                    Продолжить
                  </Button>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-8 bg-slate-900/50 border-2 border-purple-500/30 backdrop-blur-xl">
                <h3 className="text-2xl font-bold mb-6 text-purple-400">Выбери предмет для улучшения</h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {inventory.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-50">📦</div>
                      <p className="text-slate-400">Инвентарь пуст</p>
                    </div>
                  ) : (
                    inventory.map((item) => (
                      <Card
                        key={item.id}
                        className={`p-4 ${upgradeItem?.id === item.id ? 'bg-purple-500/20 border-purple-500' : `${rarityBg[item.rarity]} ${rarityBorders[item.rarity]}`} border-2 hover:scale-102 transition-all cursor-pointer backdrop-blur-sm`}
                        onClick={() => {
                          setUpgradeItem(item);
                          setUpgradeTarget(null);
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                          <div className="flex-1">
                            <h4 className={`text-sm font-bold ${rarityColors[item.rarity]}`}>{item.name}</h4>
                            <p className="text-lg font-bold text-yellow-400">${item.value}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>

              <Card className="p-8 bg-slate-900/50 border-2 border-pink-500/30 backdrop-blur-xl">
                <h3 className="text-2xl font-bold mb-6 text-pink-400">Целевой предмет</h3>
                {!upgradeItem ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 text-lg">← Сначала выбери предмет слева</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4 max-h-[350px] overflow-y-auto">
                      {getPossibleUpgrades(upgradeItem).map((item, idx) => (
                        <Card
                          key={idx}
                          className={`p-4 ${upgradeTarget?.name === item.name ? 'bg-pink-500/20 border-pink-500' : `${rarityBg[item.rarity]} ${rarityBorders[item.rarity]}`} border-2 hover:scale-102 transition-all cursor-pointer backdrop-blur-sm`}
                          onClick={() => setUpgradeTarget({ ...item, id: Date.now() })}
                        >
                          <div className="flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                            <div className="flex-1">
                              <h4 className={`text-sm font-bold ${rarityColors[item.rarity]}`}>{item.name}</h4>
                              <p className="text-lg font-bold text-yellow-400">${item.value}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {upgradeTarget && (
                      <div className="space-y-6 p-6 bg-slate-950/50 rounded-xl border border-pink-500/30">
                        <div>
                          <label className="text-sm font-bold mb-3 block text-pink-400">
                            Шанс успеха: {upgradeChance}%
                          </label>
                          <Slider
                            value={[upgradeChance]}
                            onValueChange={(v) => setUpgradeChance(v[0])}
                            min={10}
                            max={90}
                            step={5}
                            className="mb-3"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-lg">
                            <span className="text-slate-400">Стоимость:</span>
                            <span className="font-bold text-yellow-400">${calculateUpgradeCost()}</span>
                          </div>
                          <div className="flex justify-between text-lg">
                            <span className="text-slate-400">При успехе:</span>
                            <span className="font-bold text-green-400">+${upgradeTarget.value - upgradeItem.value}</span>
                          </div>
                          <div className="flex justify-between text-lg">
                            <span className="text-slate-400">При провале:</span>
                            <span className="font-bold text-red-400">-${upgradeItem.value}</span>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold text-lg py-6 shadow-xl"
                          onClick={performUpgrade}
                          disabled={isUpgrading || userStats.balance < calculateUpgradeCost()}
                        >
                          {isUpgrading ? (
                            <>
                              <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                              Улучшение...
                            </>
                          ) : userStats.balance < calculateUpgradeCost() ? (
                            'Недостаточно средств'
                          ) : (
                            `Улучшить за $${calculateUpgradeCost()}`
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8">
            <Card className="p-10 bg-slate-900/50 border-2 border-blue-500/30 backdrop-blur-xl">
              <div className="flex items-start gap-8 mb-10">
                <Avatar className="w-32 h-32 border-4 border-blue-500 shadow-xl shadow-blue-500/30">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-5xl bg-gradient-to-br from-blue-500 to-purple-500">🎮</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Player #{Math.floor(Math.random() * 99999)}
                  </h2>
                  <div className="flex items-center gap-6 mb-6">
                    <Badge className="text-xl px-4 py-2 bg-blue-500/20 text-blue-400 font-bold border-2 border-blue-500/50">
                      Level {userStats.level}
                    </Badge>
                    <span className="text-lg text-slate-400">Баланс: <span className="font-bold text-yellow-400">${userStats.balance}</span></span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Опыт до следующего уровня</span>
                      <span className="font-bold text-blue-400">{userStats.exp}/100 XP</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all shadow-lg shadow-blue-500/50"
                        style={{ width: `${userStats.exp}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="inventory" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/50">
                  <TabsTrigger value="inventory" className="font-bold text-lg">Инвентарь ({inventory.length})</TabsTrigger>
                  <TabsTrigger value="stats" className="font-bold text-lg">Статистика</TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-blue-400">Предметы: {inventory.length}</h3>
                      <p className="text-lg text-slate-400">
                        Общая стоимость: <span className="font-bold text-yellow-400">${inventory.reduce((sum, item) => sum + item.value, 0)}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={inventorySort === 'value' ? 'default' : 'outline'}
                        onClick={() => setInventorySort('value')}
                        className="font-bold"
                      >
                        По цене
                      </Button>
                      <Button
                        variant={inventorySort === 'recent' ? 'default' : 'outline'}
                        onClick={() => setInventorySort('recent')}
                        className="font-bold"
                      >
                        Последние
                      </Button>
                    </div>
                  </div>

                  {inventory.length === 0 ? (
                    <Card className="p-16 bg-slate-950/50 border-2 border-slate-800 text-center">
                      <div className="text-8xl mb-6 opacity-30">📦</div>
                      <p className="text-xl text-slate-400">Инвентарь пуст. Открой кейсы!</p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {sortedInventory.map((item) => (
                        <Card
                          key={item.id}
                          className={`p-4 ${rarityBg[item.rarity]} border-2 ${rarityBorders[item.rarity]} hover:scale-105 transition-transform backdrop-blur-sm shadow-xl ${rarityGlow[item.rarity]}`}
                        >
                          <div className="text-center space-y-3">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-contain mx-auto" />
                            <h4 className={`text-xs font-bold ${rarityColors[item.rarity]} line-clamp-2`}>{item.name}</h4>
                            <Badge variant="outline" className={`text-xs ${rarityColors[item.rarity]} font-bold`}>
                              {item.rarity}
                            </Badge>
                            <div className="text-lg font-black text-yellow-400">${item.value}</div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full font-bold"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-8 bg-blue-500/10 border-2 border-blue-500/30 backdrop-blur-sm">
                      <div className="flex items-center gap-4 mb-3">
                        <Icon name="Package" className="text-blue-400" size={28} />
                        <span className="text-sm text-slate-400 font-bold">Открыто кейсов</span>
                      </div>
                      <div className="text-4xl font-black text-blue-400">{userStats.totalOpened}</div>
                    </Card>

                    <Card className="p-8 bg-red-500/10 border-2 border-red-500/30 backdrop-blur-sm">
                      <div className="flex items-center gap-4 mb-3">
                        <Icon name="DollarSign" className="text-red-400" size={28} />
                        <span className="text-sm text-slate-400 font-bold">Потрачено</span>
                      </div>
                      <div className="text-4xl font-black text-red-400">${userStats.totalSpent}</div>
                    </Card>

                    <Card className="p-8 bg-green-500/10 border-2 border-green-500/30 backdrop-blur-sm">
                      <div className="flex items-center gap-4 mb-3">
                        <Icon name="TrendingUp" className="text-green-400" size={28} />
                        <span className="text-sm text-slate-400 font-bold">Выиграно</span>
                      </div>
                      <div className="text-4xl font-black text-green-400">${userStats.totalWon}</div>
                    </Card>

                    <Card className="p-8 bg-yellow-500/10 border-2 border-yellow-500/30 backdrop-blur-sm">
                      <div className="flex items-center gap-4 mb-3">
                        <Icon name="Percent" className="text-yellow-400" size={28} />
                        <span className="text-sm text-slate-400 font-bold">Прибыль</span>
                      </div>
                      <div className="text-4xl font-black text-yellow-400">
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
        <DialogContent className="max-w-lg bg-slate-900 border-2 border-blue-500/50">
          <DialogHeader>
            <DialogTitle className="text-3xl flex items-center gap-4 font-black">
              <span className="text-5xl">{caseOpenModal?.image}</span>
              <span className={rarityColors[caseOpenModal?.rarity || 'common']}>
                {caseOpenModal?.name}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            <div className="text-center py-6">
              {caseOpenModal?.id === 0 ? (
                <p className="text-3xl font-black text-green-400">БЕСПЛАТНО</p>
              ) : (
                <p className="text-4xl font-black text-yellow-400">${caseOpenModal?.price}</p>
              )}
            </div>

            <div>
              <label className="text-lg font-bold mb-4 block text-blue-400">
                Количество кейсов
              </label>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((count) => (
                  <Button
                    key={count}
                    variant={modalOpenCount === count ? 'default' : 'outline'}
                    onClick={() => setModalOpenCount(count)}
                    className="w-16 h-16 text-2xl font-black"
                  >
                    {count}
                  </Button>
                ))}
              </div>
              {caseOpenModal && caseOpenModal.id !== 0 && (
                <p className="text-center mt-4 text-lg">
                  Итого: <span className="font-black text-yellow-400 text-2xl">${(caseOpenModal.price * modalOpenCount)}</span>
                </p>
              )}
            </div>

            <div>
              <label className="text-lg font-bold mb-4 block text-purple-400">
                Режим открытия
              </label>
              <div className="flex gap-3">
                <Button
                  variant={!modalFastMode ? 'default' : 'outline'}
                  onClick={() => setModalFastMode(false)}
                  className="flex-1 font-bold text-lg py-6"
                >
                  <Icon name="Clock" className="mr-2" size={20} />
                  Обычный
                </Button>
                <Button
                  variant={modalFastMode ? 'default' : 'outline'}
                  onClick={() => setModalFastMode(true)}
                  className="flex-1 font-bold text-lg py-6"
                >
                  <Icon name="Zap" className="mr-2" size={20} />
                  Быстрый
                </Button>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-black text-xl py-8 shadow-2xl"
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
                '🎮 ОТКРЫТЬ!'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingCase} onOpenChange={() => setViewingCase(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-blue-500/50">
          <DialogHeader>
            <DialogTitle className="text-3xl flex items-center gap-4 font-black">
              <span className="text-5xl">{viewingCase?.image}</span>
              <span className={rarityColors[viewingCase?.rarity || 'common']}>
                {viewingCase?.name}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center py-4">
              <p className="text-slate-400 mb-3 text-lg">Возможные предметы:</p>
              <p className="text-3xl font-black text-yellow-400">
                {viewingCase?.id === 0 ? 'БЕСПЛАТНО' : `$${viewingCase?.price}`}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {viewingCase?.drops.map((item, idx) => (
                <Card
                  key={idx}
                  className={`p-4 ${rarityBg[item.rarity]} border-2 ${rarityBorders[item.rarity]} backdrop-blur-sm shadow-lg ${rarityGlow[item.rarity]}`}
                >
                  <div className="text-center space-y-2">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-contain mx-auto" />
                    <h4 className={`text-xs font-bold ${rarityColors[item.rarity]} line-clamp-2`}>
                      {item.name}
                    </h4>
                    <Badge variant="outline" className={`text-xs ${rarityColors[item.rarity]} font-bold`}>
                      {item.rarity}
                    </Badge>
                    <div className="text-sm font-bold text-yellow-400">${item.value}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
