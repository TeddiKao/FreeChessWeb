function useAudio(audioPath) {
	const audio = new Audio(audioPath);

	return audio;
}

export default useAudio