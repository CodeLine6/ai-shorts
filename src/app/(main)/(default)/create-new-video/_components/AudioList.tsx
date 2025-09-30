import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pause, Play } from 'lucide-react';
import FlagIcon from 'react-flagkit';
import React from 'react';
import { accentToCountryCode } from './Voice'; // Keep for flag mapping
import { AudioItem } from '../types'; // New import
import { cn } from '@/lib/utils';

interface AudioListProps<T extends AudioItem> {
    items: T[];
    errors: string[];
    selectedItemId: string | null;
    onSelectItem: (item: T) => void;
    onPlayPause: (item: T) => void;
    currentPlayingItemId: string | null;
    showFlag?: boolean;
    getItemKey: (item: T) => string; // Function to get unique key
    getItemName: (item: T) => string; // Function to get display name
    getItemAccent?: (item: T) => string | undefined; // Optional function for accent
    renderItemDetails?: (item: T) => React.ReactNode;
    variant?: 'default' | 'compact';
}

const AudioList = <T extends AudioItem>({
    items,
    errors,
    selectedItemId,
    onSelectItem,
    onPlayPause,
    currentPlayingItemId,
    showFlag = false,
    getItemKey,
    getItemName,
    getItemAccent,
    renderItemDetails,
    variant = 'default',
}: AudioListProps<T>) => {
    return (
        <ScrollArea className={cn(variant === 'compact' && 'mt-5 h-[200px] rounded-md border p-4', errors.length > 0 && 'border-red-500')}>
            <div className={cn( "grid gap-3", variant === 'compact' ? 'grid-cols-2': 'grid-cols-1' )}>
                {items?.map((item: T) => {
                    const itemKey = getItemKey(item);
                    const itemName = getItemName(item);
                    const itemPreviewUrl = item.url;
                    const itemAccent = getItemAccent ? getItemAccent(item) : undefined;
                    const itemDetails = renderItemDetails ? renderItemDetails(item) : null;

                    return (
                        <div
                            key={itemKey}
                            className={`cursor-pointer p-3 dark:bg-slate-900 dark:border rounded-lg hover:border-white flex justify-between ${itemKey === selectedItemId ? 'border-white' : ''}`}
                            onClick={() => onSelectItem(item)}>
                            <div>
                            <div className='flex items-center gap-2'>
                                <h2 className='font-semibold'>{itemName}</h2>
                                {showFlag && itemAccent && accentToCountryCode[itemAccent] && (
                                    <FlagIcon country={accentToCountryCode[itemAccent]} size={16} className='mr-1' />
                                )}
                            </div>
                            {itemDetails}
                            </div>
                            {itemPreviewUrl && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPlayPause(item);
                                    }}>
                                    {currentPlayingItemId === itemKey ? (
                                        <Pause className="h-5 w-5 text-blue-400" />
                                    ) : (
                                        <Play className="h-5 w-5 text-blue-400" />
                                    )}
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );
};

export default AudioList;
