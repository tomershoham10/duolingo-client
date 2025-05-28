'use client';
import { useCallback, useEffect, useState } from "react";
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { FaSearch, FaMicrophone, FaPlay, FaPause, FaDownload, FaTrash } from "react-icons/fa";
import { HiMicrophone } from "react-icons/hi";
import { useAlertStore, AlertSizes } from "../store/stores/useAlertStore";

const addAlert = useAlertStore.getState().addAlert;

// CSS for hiding scrollbars
const scrollbarHideStyle = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
  }
`;

// Mock data for recordings - replace with actual API calls later
const mockRecordings = [
    {
        id: '1',
        name: 'Recording 1',
        duration: '2:34',
        size: '1.2 MB',
        date: '2024-01-15',
        type: 'audio/wav'
    },
    {
        id: '2',
        name: 'Recording 2',
        duration: '1:45',
        size: '0.8 MB',
        date: '2024-01-14',
        type: 'audio/mp3'
    },
    {
        id: '3',
        name: 'Recording 3',
        duration: '3:12',
        size: '1.8 MB',
        date: '2024-01-13',
        type: 'audio/wav'
    }
];

const Recordings: React.FC = () => {
    const [recordings, setRecordings] = useState(mockRecordings);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [playingId, setPlayingId] = useState<string | null>(null);

    const filteredRecordings = recordings.filter(recording => 
        recording.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNewRecording = useCallback(() => {
        addAlert('Recording functionality will be implemented soon', AlertSizes.small);
    }, []);

    const handlePlayPause = (recordingId: string) => {
        if (playingId === recordingId) {
            setPlayingId(null);
        } else {
            setPlayingId(recordingId);
        }
    };

    const handleDownload = (recording: any) => {
        addAlert(`Downloading ${recording.name}...`, AlertSizes.small);
    };

    const handleDelete = (recording: any) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${recording.name}"?`);
        if (confirmed) {
            setRecordings(prev => prev.filter(r => r.id !== recording.id));
            addAlert(`${recording.name} deleted successfully`, AlertSizes.small);
        }
    };

    // Calculate statistics
    const totalRecordings = filteredRecordings.length;
    const totalSize = filteredRecordings.reduce((sum, recording) => {
        const size = parseFloat(recording.size.replace(' MB', ''));
        return sum + size;
    }, 0);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyle }} />
            <main className='flex h-full w-full flex-col items-center justify-start gap-8 p-6 bg-duoGray-lighter dark:bg-duoGrayDark-darkest overflow-y-auto scrollbar-hide'>
                {/* Header Section */}
                <section className='flex w-full max-w-7xl items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-duoBlue-default dark:bg-duoBlueDark-default'>
                            <HiMicrophone className='h-7 w-7 text-white' />
                        </div>
                        <div>
                            <h1 className='text-3xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                                Recordings
                            </h1>
                            <p className='text-duoGray-dark dark:text-duoGrayDark-light'>
                                Manage audio recordings and files
                            </p>
                        </div>
                    </div>
                    <Button
                        label='New Recording'
                        color={ButtonColors.BLUE}
                        onClick={handleNewRecording}
                    />
                </section>

                {/* Search Section */}
                <section className='w-full max-w-7xl'>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <FaSearch className='h-4 w-4 text-duoGray-dark dark:text-duoGrayDark-light' />
                        </div>
                        <input
                            type="text"
                            placeholder="Search recordings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-duoGray-light dark:border-duoGrayDark-light rounded-xl focus:ring-2 focus:ring-duoBlue-default focus:border-transparent bg-white dark:bg-duoGrayDark-darkest text-duoGray-darkest dark:text-duoGrayDark-lightest placeholder-duoGray-dark dark:placeholder-duoGrayDark-light"
                        />
                    </div>
                </section>

                {/* Statistics Dashboard */}
                <section className='w-full max-w-7xl'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        <div className='bg-white dark:bg-duoGrayDark-darkest rounded-xl border border-duoGray-light dark:border-duoGrayDark-light p-6 shadow-sm'>
                            <div className='flex items-center gap-3'>
                                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-duoBlue-lightest dark:bg-duoBlueDark-dark'>
                                    <HiMicrophone className='h-5 w-5 text-duoBlue-default dark:text-duoBlueDark-text' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-duoGray-dark dark:text-duoGrayDark-light'>Total Recordings</p>
                                    <p className='text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>{totalRecordings}</p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white dark:bg-duoGrayDark-darkest rounded-xl border border-duoGray-light dark:border-duoGrayDark-light p-6 shadow-sm'>
                            <div className='flex items-center gap-3'>
                                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-duoGreen-lightest dark:bg-duoGreenDark-dark'>
                                    <FaDownload className='h-5 w-5 text-duoGreen-default dark:text-duoGreenDark-text' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-duoGray-dark dark:text-duoGrayDark-light'>Total Size</p>
                                    <p className='text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>{totalSize.toFixed(1)} MB</p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white dark:bg-duoGrayDark-darkest rounded-xl border border-duoGray-light dark:border-duoGrayDark-light p-6 shadow-sm'>
                            <div className='flex items-center gap-3'>
                                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-duoRed-lightest dark:bg-duoRedDark-dark'>
                                    <FaPlay className='h-5 w-5 text-duoRed-default dark:text-duoRedDark-text' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-duoGray-dark dark:text-duoGrayDark-light'>Currently Playing</p>
                                    <p className='text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>{playingId ? '1' : '0'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recordings Grid */}
                <section className='w-full max-w-7xl'>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="w-8 h-8 border-4 border-duoBlue-default border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredRecordings.length > 0 ? (
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                            {filteredRecordings.map((recording) => (
                                <div 
                                    key={recording.id} 
                                    className='group relative overflow-hidden rounded-xl border border-duoGray-light bg-white shadow-sm transition-all duration-300 hover:border-duoBlue-light hover:shadow-lg hover:-translate-y-1 dark:border-duoGrayDark-light dark:bg-duoGrayDark-darkest dark:hover:border-duoBlueDark-text'
                                >
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(recording)}
                                        className='absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-duoRed-default opacity-0 transition-all duration-200 hover:bg-duoRed-lighter hover:text-duoRed-darker group-hover:opacity-100 dark:bg-duoGrayDark-darkest/80 dark:hover:bg-duoRed-default dark:hover:text-white'
                                        title='Delete recording'
                                    >
                                        <FaTrash className="h-3 w-3" />
                                    </button>

                                    {/* Recording Header */}
                                    <div className='h-20 bg-gradient-to-br from-duoBlue-default to-duoBlue-dark dark:from-duoBlueDark-default dark:to-duoBlueDark-dark'>
                                        <div className='flex h-full items-center justify-center'>
                                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
                                                <FaMicrophone className='h-6 w-6 text-white' />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recording Content */}
                                    <div className='p-6'>
                                        <div className='flex flex-col gap-3'>
                                            <h2 className='text-xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                                                {recording.name}
                                            </h2>
                                            
                                            <div className='space-y-1'>
                                                <p className='text-sm text-duoGray-dark dark:text-duoGrayDark-light'>
                                                    Duration: {recording.duration}
                                                </p>
                                                <p className='text-sm text-duoGray-dark dark:text-duoGrayDark-light'>
                                                    Size: {recording.size}
                                                </p>
                                                <p className='text-sm text-duoGray-dark dark:text-duoGrayDark-light'>
                                                    Date: {recording.date}
                                                </p>
                                            </div>
                                            
                                            {/* Recording Actions */}
                                            <div className='flex items-center justify-between pt-3 border-t border-duoGray-light dark:border-duoGrayDark-light'>
                                                <button
                                                    onClick={() => handlePlayPause(recording.id)}
                                                    className='flex items-center gap-2 py-2 px-3 rounded-lg transition-all hover:bg-duoBlue-lightest dark:hover:bg-duoBlueDark-dark hover:text-duoBlue-dark dark:hover:text-duoBlueDark-text'
                                                >
                                                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-duoBlue-lightest dark:bg-duoBlueDark-dark'>
                                                        {playingId === recording.id ? (
                                                            <FaPause className='h-3 w-3 text-duoBlue-default dark:text-duoBlueDark-text' />
                                                        ) : (
                                                            <FaPlay className='h-3 w-3 text-duoBlue-default dark:text-duoBlueDark-text' />
                                                        )}
                                                    </div>
                                                    <span className='text-xs font-medium text-duoGray-dark dark:text-duoGrayDark-light'>
                                                        {playingId === recording.id ? 'Pause' : 'Play'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(recording)}
                                                    className='flex items-center gap-2 py-2 px-3 rounded-lg transition-all hover:bg-duoGreen-lightest dark:hover:bg-duoGreenDark-dark hover:text-duoGreen-dark dark:hover:text-duoGreenDark-text'
                                                >
                                                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-duoGreen-lightest dark:bg-duoGreenDark-dark'>
                                                        <FaDownload className='h-3 w-3 text-duoGreen-default dark:text-duoGreenDark-text' />
                                                    </div>
                                                    <span className='text-xs font-medium text-duoGray-dark dark:text-duoGrayDark-light'>
                                                        Download
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className='flex flex-col items-center justify-center py-16'>
                            <div className='flex h-24 w-24 items-center justify-center rounded-full bg-duoGray-light dark:bg-duoGrayDark-light'>
                                <HiMicrophone className='h-12 w-12 text-duoGray-dark dark:text-duoGrayDark-lightest' />
                            </div>
                            <h3 className='mt-6 text-xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                                {searchQuery ? 'No recordings found' : 'No recordings yet'}
                            </h3>
                            <p className='mt-2 text-center text-duoGray-dark dark:text-duoGrayDark-light max-w-md'>
                                {searchQuery 
                                    ? `No recordings match your search for "${searchQuery}". Try adjusting your search terms.`
                                    : 'Get started by creating your first recording. You can upload audio files or record directly.'
                                }
                            </p>
                            {!searchQuery && (
                                <div className='mt-6'>
                                    <Button
                                        label='Create Your First Recording'
                                        color={ButtonColors.BLUE}
                                        onClick={handleNewRecording}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
};

export default Recordings; 