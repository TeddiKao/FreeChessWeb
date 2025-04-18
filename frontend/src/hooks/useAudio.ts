function useAudio(audioPath: string) {
	const audio = new Audio(audioPath);

	return audio;
}

export default useAudio