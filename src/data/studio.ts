/* AI content generation — video and image work, sourced from the Drive
   portfolio folder and re-encoded for the web (540p H.264 + webp posters).
   Model labels come from the generator's own export filenames; where the
   export didn't record a model, the tag says so rather than guessing. */

export type StudioCat = 'Spec ads' | 'Cinematic' | 'Characters' | 'Product' | 'Images';

export type StudioItem = {
    id: string;
    title: string;
    cat: StudioCat;
    model: string;
    kind: 'video' | 'image';
    /** portrait | landscape — drives the masonry span */
    shape: 'tall' | 'wide';
    note: string;
};

export const DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1O8acef1kl6LuIFuo7I3l3vauvuBl_4Fu';

export const STUDIO: StudioItem[] = [
    { id: 'watch-ad', title: 'Luxury watch — reel', cat: 'Spec ads', model: 'Veo 3 · Flow', kind: 'video', shape: 'tall', note: 'Vertical 9:16 product reel, lit like a studio pack-shot.' },
    { id: 'headphones', title: 'Wireless headphones', cat: 'Spec ads', model: 'AI video', kind: 'video', shape: 'wide', note: 'Macro product ad: touch controls, material close-ups.' },
    { id: 'lipsync', title: 'Podcast host', cat: 'Characters', model: 'Lipsync-2 Pro', kind: 'video', shape: 'wide', note: 'Generated presenter, lip-synced to a separate voice track.' },
    { id: 'bank-reel', title: 'Bank — Instagram reel', cat: 'Spec ads', model: 'Veo 3 · Flow', kind: 'video', shape: 'tall', note: 'Surreal storyboard concept for a fintech campaign.' },
    { id: 'king', title: 'The battle-weary king', cat: 'Cinematic', model: 'Kling 2.5', kind: 'video', shape: 'wide', note: 'Photoreal character shot from a structured JSON prompt.' },
    { id: 'micellar', title: 'Skincare — micellar water', cat: 'Spec ads', model: 'Veo 3 · Flow', kind: 'video', shape: 'tall', note: 'UGC-style beauty ad, product held consistent across frames.' },
    { id: 'truck', title: 'Pickup in the desert', cat: 'Spec ads', model: 'Veo 3 · Flow', kind: 'video', shape: 'wide', note: 'Automotive spot — tracking shot, heat haze, dust trail.' },
    { id: 'camille', title: "Camille's day", cat: 'Characters', model: 'Veo 3 · Flow', kind: 'video', shape: 'tall', note: 'One character across four atmospheres — identity held shot to shot.' },
    { id: 'fortress', title: 'Fortress entrance', cat: 'Cinematic', model: 'Kling 2.6', kind: 'video', shape: 'wide', note: 'Post-apocalyptic world establishing shot; keyframe from Nano Banana Pro.' },
    { id: 'jeans', title: 'Flared jeans — street', cat: 'Spec ads', model: 'Veo 3 · Flow', kind: 'video', shape: 'tall', note: 'Fashion reel; garment fit and fabric motion.' },
    { id: 'monologue', title: 'Oil worker monologue', cat: 'Characters', model: 'Veo 3', kind: 'video', shape: 'wide', note: 'Dialogue scene with native audio — performance, not just motion.' },
    { id: 'surreal', title: 'Creation, in sand', cat: 'Cinematic', model: 'Veo 3 · Flow', kind: 'video', shape: 'tall', note: 'Animated surreal storyboard for an Instagram series.' },
    { id: 'trainers', title: 'Running trainers', cat: 'Spec ads', model: 'Veo 3 · Flow', kind: 'video', shape: 'wide', note: 'Footwear spot — low tracking angle down a corridor.' },
    { id: 'reel-story', title: 'City story — reel', cat: 'Characters', model: 'Veo 3 · Flow', kind: 'video', shape: 'tall', note: 'Instagram reel ad storyboard, generated shot by shot.' },
    { id: 'kling-real', title: 'Skydive POV', cat: 'Cinematic', model: 'Kling O3', kind: 'video', shape: 'wide', note: 'High-motion realism test: exit from the aircraft door.' },
    { id: 'malt', title: 'Malt drink — UGC', cat: 'Spec ads', model: 'Veo 3 · Flow', kind: 'video', shape: 'tall', note: 'Talking-to-camera beverage ad.' },
    { id: 'tv-story', title: 'TV — storyboard', cat: 'Spec ads', model: 'Veo 3 · Flow', kind: 'video', shape: 'wide', note: 'Consumer-electronics storyboard animated into a spot.' },
    { id: 'travel', title: 'Trip planner', cat: 'Product', model: 'Veo 3 · Flow', kind: 'video', shape: 'tall', note: 'App-style explainer: booking a trip, then living it.' },
    { id: 'vodka', title: 'Chocolate vodka', cat: 'Spec ads', model: 'Kling 2.6', kind: 'video', shape: 'wide', note: 'Drinks spot from campaign metadata JSON — brand, product, style.' },
    { id: 'heatwave', title: 'European heatwave', cat: 'Characters', model: 'AI video', kind: 'video', shape: 'tall', note: 'Editorial social clip — mood, wardrobe, light.' },
    { id: 'hf-1', title: 'Ember battle', cat: 'Cinematic', model: 'Higgsfield', kind: 'video', shape: 'wide', note: 'Action beat with particle-heavy lighting.' },
    { id: 'gameplay', title: 'Game world flythrough', cat: 'Cinematic', model: 'AI video', kind: 'video', shape: 'tall', note: 'Environment concept, game-trailer style.' },
    { id: 'tasker-promo', title: 'Tasker — launch promo', cat: 'Product', model: 'Veo 3 · Flow', kind: 'video', shape: 'wide', note: 'Launch video for my own Chrome extension.' },
    { id: 'aura', title: 'AURA — home appliance', cat: 'Spec ads', model: 'AI video', kind: 'video', shape: 'wide', note: 'Kitchen lifestyle commercial.' },
    { id: 'veo-animate', title: 'Harbour moment', cat: 'Characters', model: 'Veo 3', kind: 'video', shape: 'wide', note: 'Still image animated into a short scene.' },

    { id: 'promo3', title: 'Jogging shoe — promo', cat: 'Images', model: 'Nano Banana 2', kind: 'image', shape: 'wide', note: 'Ad creative with in-image typography and offer.' },
    { id: 'gen1', title: 'Warrior portrait', cat: 'Images', model: 'Image gen', kind: 'image', shape: 'wide', note: 'Character key art.' },
    { id: 'promo1', title: 'Shoe promo — track', cat: 'Images', model: 'Nano Banana 2', kind: 'image', shape: 'wide', note: 'Same product, new scene and copy — a scalable ad set.' },
    { id: 'pilot', title: 'Pilot, departures', cat: 'Images', model: 'Image gen', kind: 'image', shape: 'wide', note: 'Photoreal editorial frame.' },
    { id: 'promo2', title: 'Shoe promo — unboxing', cat: 'Images', model: 'Nano Banana 2', kind: 'image', shape: 'wide', note: 'Variant three of the ad set.' },
    { id: 'f20', title: 'Trading floor', cat: 'Images', model: 'Image gen', kind: 'image', shape: 'wide', note: 'Freelance explainer-video frame.' },
];

/* Interactive 3D worlds generated with World Labs Marble. */
export const MARBLE_WORLDS = [
    '0007ca41-6e04-47a7-b3cf-f4c2c9f372d5',
    'c79cfa02-265e-4aad-8c2e-bfae9fd8a22e',
    'eaf7a6be-601c-4cf2-9af2-388bfad7271e',
    '0a6c848f-6a23-4f41-811e-e00c12ab9b97',
    '00eee396-d19b-4063-afd2-8abe74de30cc',
    '4846b76b-f426-4380-863d-c8479a8277aa',
    '11db85f7-ed8f-4a23-81ab-189c3f872a9b',
];
