"REQUIRE util.js";
"REQUIRE piece.jsx";
"REQUIRE board.jsx";
"REQUIRE models/model.js";
"REQUIRE solver.js";

const Game = function(props){
	const xSize = model.xSize, ySize = model.ySize;
	const cells = model.cells;
	const pieces = model.pieces;

	const positions = [], setPositions = [];
	for(let p of pieces){
		[positions[p.id], setPositions[p.id]] = React.useState(p.position);
	}

	const [turn, setTurn] = React.useState(model.turn);

	const [lastMove, setLastMove] = React.useState(null);

	const [isRunning, setIsRunning] = React.useState(false);
	const start = () => {
		setIsRunning(true);
		setIsInitial(false);
		model.clocks[turn].start();
		setIsAfterMove(true);
	}
	const stop = () => {
		model.clocks[turn].stop();
		solver.cancel();
		setIsRunning(false);
	}

	const [alert, setAlert] = React.useState(null);

	const [isInitial, setIsInitial] = React.useState(true);
	const init = () => {
		for(let p of pieces) setPositions[p.id](p.position);
		setTurn(model.turn);
		setLastMove(null);
		setIsRunning(false);
		for(let clock of model.clocks){
			clock.stop();
			clock.reset();
		}
		setTimes([0, 0]);
		openMenu();
	}
	React.useEffect(() => {
		if(isInitial) init();
	}, [isInitial]);

	const openMenu = () => {
		if(isInitial) setAlert({
			options: [
				{ caption: "新規対局", onClick: start, isPrimary: true },
				{ caption: "あとで", onClick: () => void 0 },
			]
		});
		else if( ! isRunning) setAlert({
			options: [
				{ caption: "対局再開", onClick: start },
				{ caption: "リセット", onClick: () => { setIsInitial(true), init(); } },
			]
		});
		else setAlert({
			options: [
				! model.useAi[turn] && { caption: "投了します", onClick: resign },
				{ caption: "中断", onClick: stop }
			]
		});
	}

	const checkWinner = () => {
		if( ! isRunning) return;
		const winner = model.checkWinner(positions);
		if(winner){
			setIsRunning(false);
			setAlert({
				title: "",
				message: ["先手", "後手"][winner.player] + "の勝ちです。",
				options: [
					{ caption: "OK", onClick: stop },
				]
			});
		}
	};

	const resign = () => {
		setIsRunning(false);
		setAlert({
			title: "",
			message: "投了しました。" + ["先手", "後手"][1 - turn] + "の勝ちです。",
			options: [
				{ caption: "OK", onClick: stop },
			]
		});
	}

	const move = (piece, cell) => {
		if( ! model.checkCanMove(piece, cell, positions)) return;
		const promo = model.checkPromotion(piece, cell, positions);
		if(promo[0] && promo[1]){
			setAlert({
				options: [
					{ caption: "成る", onClick: () => moveWithFace(piece, cell, 1), isPrimary: true },
					{ caption: "成らない", onClick: () => moveWithFace(piece, cell, 0) },
				]				
			});
		}
		else moveWithFace(piece, cell, promo[0] ? 0 : 1);
	}
	const moveWithFace = (piece, cell, face) => {
		for(let p of pieces.filter(p =>
			positions[p.id].x == cell.x && positions[p.id].y == cell.y
		)) moveToKomadai(p, positions[piece.id].player);
		setPositions[piece.id](pos => ({
			...pos,
			x: cell.x,
			y: cell.y,
			face: face,
			isOut: false,
			isFloating: false
		}));
		model.clocks[turn].stop();
		model.clocks[1 - turn].start();
		setTurn(1 - turn);
		setLastMove({ piece, cell, face });
		setIsAfterMove(true);
	};
	const moveToKomadai = (piece, player) => {
		setPositions[piece.id](pos => ({
			...pos, 
			x: -1,
			y: -1,
			face: 0,
			player: player,
			isOut: true,
			isFloating: false,
			isExcluded: piece.entity.isSingleUse,
		}));
	};

	const handleAiMove = (m) => { // m: move object
		if(isRunning && m) moveWithFace(m.piece, m.cell, m.face);
		else resign(); // no possible move
	}

	const [times, setTimes] = React.useState([0, 0]);
	React.useEffect(() => {
		if( ! isRunning) return;
		const hndTimer = setTimeout(() => {
			setTimes([0, 1].map(t => model.clocks[t].getTime()));
		}, 1000 - times[turn] % 1000);
		return () => {
			clearTimeout(hndTimer);
		}
	}, [times, turn, isRunning]);

	const [isAfterMove, setIsAfterMove] = React.useState(false);
	React.useEffect(() => {
		if( ! isAfterMove) return;
		setIsAfterMove(false);
		checkWinner();
		if( ! isRunning) return;
		if(model.useAi[turn]) setIsCallingAi(true);
	}, [isRunning, isAfterMove, positions, turn]);

	const [isCallingAi, setIsCallingAi] = React.useState(false);
	React.useEffect(() => {
		if( ! isCallingAi) return;
		setIsCallingAi(false);
		if( ! isRunning) return;
		solver.solve(positions, turn, handleAiMove);
	}, [isCallingAi, isRunning]);


	return (
		<React.Fragment>
			<div className={"game" + (isRunning ? " running" : "")}>
				<SystemArea turn={turn} times={times} />
				<Board
					xSize={xSize} ySize={ySize}
					cells={cells}
					pieces={pieces}
					positions={pieces.map(p => positions[p.id])}
					lastMove={lastMove}
					isRunning={isRunning}
					checkCanMove={(piece, cell) => model.checkCanMove(piece, cell, positions)}
					checkIsPickable={(piece) =>
						isRunning && ! model.useAi[turn] && model.checkIsPickable(piece, positions, turn)
					}
					move={move}
					openMenu={openMenu}
				/>
			</div>
			{alert && <Modal onClose={() => setAlert(null)}>
				{alert.title && <div className="modal-title">{alert.title}</div>}
				<div className="modal-body">
					{alert.message && <div className="alert-message">{alert.message}</div>}
					{alert.options.map(opt => 
						opt && <button
							className={opt.isPrimary ? "primaryButton" : ""}
							onClick={() => {setAlert(null); opt.onClick()}}
							key={opt.caption}
						>{opt.caption}</button>
					)}
				</div>
			</Modal>}
		</React.Fragment>
	)
}
