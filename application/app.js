var io,
	gameSocket;

exports.initGame = function(sio, socket) {
	io = sio;
	gameSocket = socket;

	// Bind custom event handlers to the socket
    gameSocket.on('showHeroSummary', showHeroSummary);
    gameSocket.on('showJourneyScreen', showJourneyScreen);
};

function showHeroSummary () {
	this.emit("renderHeroSummary");
};

function showJourneyScreen () {
	this.emit("renderJourneyOverview");
};