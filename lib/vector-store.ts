import { GeminiClient } from './gemini';
import { cosineSimilarity } from './utils';
import { SearchResult } from '@/types';

interface VectorEntry {
    id: string;
    text: string;
    embedding: number[];
    metadata: {
        ingredient: string;
        description: string;
        category: string;
        commonUses: string[];
        typicalDosage: string;
    };
}

// Seed database of common supplement ingredients
const SEED_INGREDIENTS = [
    {
        ingredient: 'Melatonin',
        description: 'A hormone that regulates sleep-wake cycles. Used as a supplement to improve sleep quality and reduce jet lag.',
        category: 'Hormonal Balance',
        commonUses: ['Sleep support', 'Jet lag', 'Circadian rhythm regulation'],
        typicalDosage: '0.5-5mg before bedtime',
    },
    {
        ingredient: 'Magnesium Glycinate',
        description: 'A highly bioavailable form of magnesium that supports muscle relaxation, nerve function, and sleep quality.',
        category: 'Minerals',
        commonUses: ['Sleep support', 'Muscle relaxation', 'Stress reduction', 'Bone health'],
        typicalDosage: '200-400mg daily',
    },
    {
        ingredient: 'L-Theanine',
        description: 'An amino acid found in green tea that promotes relaxation without drowsiness. Enhances alpha brain wave activity.',
        category: 'Amino Acids',
        commonUses: ['Sleep support', 'Stress reduction', 'Cognitive focus', 'Anxiety relief'],
        typicalDosage: '100-400mg daily',
    },
    {
        ingredient: 'Valerian Root',
        description: 'An herbal extract traditionally used to promote relaxation and improve sleep quality. May increase GABA levels.',
        category: 'Herbal Extracts',
        commonUses: ['Sleep support', 'Anxiety relief', 'Relaxation'],
        typicalDosage: '300-600mg before bedtime',
    },
    {
        ingredient: '5-HTP',
        description: '5-Hydroxytryptophan is a precursor to serotonin and melatonin. Supports mood and sleep regulation.',
        category: 'Amino Acids',
        commonUses: ['Sleep support', 'Mood enhancement', 'Appetite control'],
        typicalDosage: '50-300mg daily',
    },
    {
        ingredient: 'GABA',
        description: 'Gamma-Aminobutyric acid is the primary inhibitory neurotransmitter in the brain. Promotes calmness and relaxation.',
        category: 'Amino Acids',
        commonUses: ['Sleep support', 'Anxiety relief', 'Stress reduction'],
        typicalDosage: '250-750mg daily',
    },
    {
        ingredient: 'Ashwagandha',
        description: 'An adaptogenic herb that helps the body manage stress. Supports cortisol regulation and overall vitality.',
        category: 'Adaptogens',
        commonUses: ['Stress reduction', 'Energy', 'Cognitive health', 'Sleep support'],
        typicalDosage: '300-600mg standardized extract',
    },
    {
        ingredient: 'Rhodiola Rosea',
        description: 'An adaptogen that enhances physical and mental performance under stress. Supports ATP production.',
        category: 'Adaptogens',
        commonUses: ['Energy', 'Stress reduction', 'Cognitive focus', 'Physical performance'],
        typicalDosage: '200-600mg daily',
    },
    {
        ingredient: 'Creatine Monohydrate',
        description: 'A compound that supports ATP regeneration in muscle cells. Enhances strength, power, and cognitive performance.',
        category: 'Amino Acids',
        commonUses: ['Sports nutrition', 'Muscle strength', 'Cognitive health', 'Energy'],
        typicalDosage: '3-5g daily',
    },
    {
        ingredient: 'Beta-Alanine',
        description: 'A non-essential amino acid that buffers acid in muscles, reducing fatigue during high-intensity exercise.',
        category: 'Amino Acids',
        commonUses: ['Sports nutrition', 'Endurance', 'Muscle performance'],
        typicalDosage: '2-5g daily',
    },
    {
        ingredient: 'Caffeine',
        description: 'A central nervous system stimulant that improves alertness, focus, and physical performance.',
        category: 'Other',
        commonUses: ['Energy', 'Cognitive focus', 'Physical performance', 'Weight management'],
        typicalDosage: '100-400mg daily',
    },
    {
        ingredient: 'Omega-3 Fatty Acids',
        description: 'Essential fatty acids (EPA/DHA) that support cardiovascular health, brain function, and reduce inflammation.',
        category: 'Fatty Acids',
        commonUses: ['Heart health', 'Cognitive health', 'Joint health', 'Anti-inflammatory'],
        typicalDosage: '1-3g combined EPA+DHA daily',
    },
    {
        ingredient: 'Vitamin D3',
        description: 'The sunshine vitamin essential for bone health, immune function, and mood regulation.',
        category: 'Vitamins',
        commonUses: ['Bone health', 'Immune support', 'Mood regulation', 'General wellness'],
        typicalDosage: '1000-4000 IU daily',
    },
    {
        ingredient: 'Zinc',
        description: 'An essential mineral for immune function, wound healing, DNA synthesis, and testosterone production.',
        category: 'Minerals',
        commonUses: ['Immune support', 'Wound healing', 'Hormonal balance', 'Skin health'],
        typicalDosage: '15-30mg daily',
    },
    {
        ingredient: 'Probiotics',
        description: 'Beneficial bacteria that support gut microbiome balance, digestion, and immune function.',
        category: 'Probiotics',
        commonUses: ['Digestive health', 'Immune support', 'Gut health', 'Nutrient absorption'],
        typicalDosage: '1-50 billion CFU daily',
    },
    {
        ingredient: 'Collagen Peptides',
        description: 'Hydrolyzed collagen protein that supports skin elasticity, joint health, and tissue repair.',
        category: 'Proteins',
        commonUses: ['Beauty & skin', 'Joint health', 'Tissue repair', 'Bone health'],
        typicalDosage: '5-15g daily',
    },
    {
        ingredient: 'Turmeric/Curcumin',
        description: 'A potent anti-inflammatory compound from turmeric root. Supports joint health and cognitive function.',
        category: 'Herbal Extracts',
        commonUses: ['Anti-inflammatory', 'Joint health', 'Cognitive health', 'Antioxidant'],
        typicalDosage: '500-2000mg curcuminoids daily',
    },
    {
        ingredient: 'CoQ10',
        description: 'Coenzyme Q10 is an antioxidant that supports mitochondrial energy production and cardiovascular health.',
        category: 'Antioxidants',
        commonUses: ['Heart health', 'Energy production', 'Antioxidant', 'Cognitive health'],
        typicalDosage: '100-300mg daily',
    },
    {
        ingredient: 'Bacopa Monnieri',
        description: 'An herb used in Ayurvedic medicine to enhance memory, learning, and cognitive function.',
        category: 'Nootropics',
        commonUses: ['Cognitive health', 'Memory enhancement', 'Learning', 'Stress reduction'],
        typicalDosage: '300-600mg standardized extract',
    },
    {
        ingredient: "Lion's Mane Mushroom",
        description: 'A medicinal mushroom that supports nerve growth factor (NGF) production and cognitive function.',
        category: 'Nootropics',
        commonUses: ['Cognitive health', 'Nerve health', 'Memory', 'Focus'],
        typicalDosage: '500-3000mg daily',
    },
    {
        ingredient: 'Vitamin C',
        description: 'An essential antioxidant vitamin that supports immune function, collagen synthesis, and iron absorption.',
        category: 'Vitamins',
        commonUses: ['Immune support', 'Antioxidant', 'Skin health', 'Iron absorption'],
        typicalDosage: '500-2000mg daily',
    },
    {
        ingredient: 'Iron',
        description: 'An essential mineral for oxygen transport, energy production, and immune function.',
        category: 'Minerals',
        commonUses: ['Energy', 'Oxygen transport', 'Immune support', 'Cognitive health'],
        typicalDosage: '18-27mg daily',
    },
    {
        ingredient: 'Calcium',
        description: 'The most abundant mineral in the body, essential for bone health, muscle function, and nerve signaling.',
        category: 'Minerals',
        commonUses: ['Bone health', 'Muscle function', 'Nerve health', 'Heart health'],
        typicalDosage: '1000-1200mg daily',
    },
    {
        ingredient: 'B-Complex Vitamins',
        description: 'A group of eight water-soluble vitamins essential for energy metabolism, nerve function, and red blood cell formation.',
        category: 'Vitamins',
        commonUses: ['Energy', 'Nerve health', 'Cognitive health', 'General wellness'],
        typicalDosage: 'Varies by specific B vitamin',
    },
    {
        ingredient: 'Glucosamine',
        description: 'A compound naturally found in cartilage that supports joint health and may reduce osteoarthritis symptoms.',
        category: 'Amino Acids',
        commonUses: ['Joint health', 'Bone health', 'Mobility'],
        typicalDosage: '1500mg daily',
    },
    {
        ingredient: 'Chondroitin',
        description: 'A component of cartilage that helps retain water and supports joint flexibility and cushioning.',
        category: 'Other',
        commonUses: ['Joint health', 'Bone health', 'Mobility'],
        typicalDosage: '800-1200mg daily',
    },
    {
        ingredient: 'Hyaluronic Acid',
        description: 'A molecule that retains moisture in skin and joints, supporting hydration and tissue lubrication.',
        category: 'Other',
        commonUses: ['Beauty & skin', 'Joint health', 'Eye health'],
        typicalDosage: '120-200mg daily',
    },
    {
        ingredient: 'Green Tea Extract',
        description: 'Rich in catechins (especially EGCG), supports metabolism, antioxidant activity, and cognitive function.',
        category: 'Herbal Extracts',
        commonUses: ['Weight management', 'Antioxidant', 'Cognitive health', 'Heart health'],
        typicalDosage: '250-500mg EGCG daily',
    },
    {
        ingredient: 'Resveratrol',
        description: 'A polyphenol found in grapes and berries with antioxidant and anti-inflammatory properties.',
        category: 'Antioxidants',
        commonUses: ['Heart health', 'Anti-aging', 'Antioxidant', 'Cognitive health'],
        typicalDosage: '150-500mg daily',
    },
    {
        ingredient: 'DHEA',
        description: 'Dehydroepiandrosterone is a hormone precursor that supports hormonal balance and may have anti-aging effects.',
        category: 'Hormonal Balance',
        commonUses: ['Hormonal balance', 'Anti-aging', 'Energy', 'Immune support'],
        typicalDosage: '25-50mg daily',
    },
    {
        ingredient: 'Saw Palmetto',
        description: 'An herbal extract traditionally used to support prostate health and hormonal balance in men.',
        category: 'Herbal Extracts',
        commonUses: ['Prostate health', 'Hormonal balance', 'Hair health'],
        typicalDosage: '320mg daily',
    },
    {
        ingredient: 'Maca Root',
        description: 'An adaptogenic root vegetable that supports energy, stamina, and hormonal balance.',
        category: 'Adaptogens',
        commonUses: ['Energy', 'Hormonal balance', 'Libido', 'Mood'],
        typicalDosage: '1500-3000mg daily',
    },
    {
        ingredient: 'Milk Thistle',
        description: 'An herb containing silymarin that supports liver health and detoxification processes.',
        category: 'Herbal Extracts',
        commonUses: ['Liver health', 'Detox', 'Antioxidant'],
        typicalDosage: '140-420mg silymarin daily',
    },
    {
        ingredient: 'Digestive Enzymes',
        description: 'A blend of enzymes (amylase, protease, lipase) that support breakdown and absorption of nutrients.',
        category: 'Enzymes',
        commonUses: ['Digestive health', 'Nutrient absorption', 'Bloating relief'],
        typicalDosage: 'Varies by formulation',
    },
    {
        ingredient: 'Fiber',
        description: 'Dietary fiber supports digestive health, blood sugar regulation, and cholesterol management.',
        category: 'Other',
        commonUses: ['Digestive health', 'Weight management', 'Heart health', 'Blood sugar'],
        typicalDosage: '25-38g daily',
    },
    {
        ingredient: 'Electrolytes',
        description: 'Essential minerals (sodium, potassium, magnesium) that regulate hydration, nerve function, and muscle contractions.',
        category: 'Minerals',
        commonUses: ['Hydration', 'Sports nutrition', 'Muscle function', 'Recovery'],
        typicalDosage: 'Varies by specific electrolyte',
    },
];

export class VectorStore {
    private entries: VectorEntry[] = [];
    private client: GeminiClient | null = null;
    private initialized = false;

    constructor(apiKey?: string) {
        if (apiKey) {
            this.client = new GeminiClient({ apiKey, model: 'gemini-embedding-2' });
        }
    }

    async initialize(): Promise<void> {
        if (this.initialized || !this.client) return;

        // Check localStorage for cached embeddings
        const cached = this.loadFromStorage();
        if (cached && cached.length === SEED_INGREDIENTS.length) {
            this.entries = cached;
            this.initialized = true;
            return;
        }

        // Generate embeddings for all seed ingredients
        const texts = SEED_INGREDIENTS.map(item =>
            `${item.ingredient}: ${item.description}. Category: ${item.category}. Uses: ${item.commonUses.join(', ')}.`
        );

        try {
            const embeddings = await this.client.batchEmbedContents(texts);

            this.entries = SEED_INGREDIENTS.map((item, index) => ({
                id: `seed-${index}`,
                text: texts[index],
                embedding: embeddings[index] || [],
                metadata: {
                    ingredient: item.ingredient,
                    description: item.description,
                    category: item.category,
                    commonUses: item.commonUses,
                    typicalDosage: item.typicalDosage,
                },
            }));

            this.saveToStorage();
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize vector store:', error);
            throw error;
        }
    }

    async search(query: string, topK: number = 5): Promise<SearchResult[]> {
        if (!this.client) {
            throw new Error('Vector store not initialized with API key');
        }

        if (!this.initialized) {
            await this.initialize();
        }

        const queryEmbedding = await this.client.embedContent(
            `task: search result | query: ${query}`
        );

        const results = this.entries
            .map(entry => ({
                entry,
                similarity: cosineSimilarity(queryEmbedding, entry.embedding),
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);

        return results.map(r => ({
            ingredient: r.entry.metadata.ingredient,
            description: r.entry.metadata.description,
            similarity: Math.round(r.similarity * 1000) / 1000,
            category: r.entry.metadata.category,
            commonUses: r.entry.metadata.commonUses,
            typicalDosage: r.entry.metadata.typicalDosage,
        }));
    }

    async addIngredient(
        ingredient: string,
        description: string,
        category: string,
        commonUses: string[],
        typicalDosage: string
    ): Promise<void> {
        if (!this.client) return;

        const text = `${ingredient}: ${description}. Category: ${category}. Uses: ${commonUses.join(', ')}.`;
        const embedding = await this.client.embedContent(text);

        this.entries.push({
            id: `custom-${Date.now()}`,
            text,
            embedding,
            metadata: {
                ingredient,
                description,
                category,
                commonUses,
                typicalDosage,
            },
        });

        this.saveToStorage();
    }

    private saveToStorage(): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('vector-store-entries', JSON.stringify(this.entries));
        }
    }

    private loadFromStorage(): VectorEntry[] | null {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('vector-store-entries');
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch {
                    return null;
                }
            }
        }
        return null;
    }

    getAllIngredients(): string[] {
        return this.entries.map(e => e.metadata.ingredient);
    }
}

// Singleton instance
let vectorStoreInstance: VectorStore | null = null;

export function getVectorStore(apiKey?: string): VectorStore {
    if (!vectorStoreInstance || (apiKey && !vectorStoreInstance)) {
        vectorStoreInstance = new VectorStore(apiKey);
    }
    return vectorStoreInstance;
}
