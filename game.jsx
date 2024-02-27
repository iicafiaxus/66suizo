"REQUIRE util.js";
"REQUIRE piece.jsx";
"REQUIRE board.jsx";
"REQUIRE models/model.js";
"REQUIRE solver.js";
"REQUIRE solver2.js";

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
	const [history, setHistory] = React.useState([]);

	const [isRunning, setIsRunning] = React.useState(false);
	const start = (turnToStart = turn) => {
		if(turnToStart == 0) setStatus("あなたの手番です。");
		setIsRunning(true);
		setIsInitial(false);
		model.clocks[turnToStart].start();
		setIsAfterMove(true);
	}
	const stop = () => {
		setStatus("");
		model.clocks[turn].stop();
		solver.cancel();
		setIsRunning(false);
	}

	const [alert, setAlert] = React.useState(null);
	const [status, setStatus] = React.useState("");

	const [isInitial, setIsInitial] = React.useState(true);
	const init = () => {
		for(let p of pieces) setPositions[p.id](p.position);
		setTurn(model.turn);
		setLastMove(null);
		setHistory([]);
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
			message: "先後を決めましょう。",
			options: [
				{ caption: "ＡＩが先手", onClick: () => setTurn(1) + start(1) },
				{ caption: "あなたが先手", onClick: () => setTurn(0) + start(0) },
				{ caption: "ランダム", onClick: () => setTurn(Math.floor(Math.random() * 2)) + start() },
			]
		});
		else if( ! isRunning) setAlert({
			message: "対局を再開します。",
			options: [
				{ caption: "初めから", onClick: () => { setIsInitial(true), init(); } },
				{ caption: "つづきから", onClick: start },
			]
		});
		else setAlert({
			message: "どうしますか？",
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
			const message = ["あなた", "ＡＩ"][winner.player] + "の勝ちです。";
			setAlert({
				title: "",
				message,
				options: [
					{ caption: "ＯＫ", onClick: stop },
				]
			});
			setStatus(message);
		}
	};

	const resign = () => {
		setIsRunning(false);
		const message = "投了しました。" + ["あなた", "ＡＩ"][1 - turn] + "の勝ちです。";
		setAlert({
			title: "",
			message,
			options: [
				{ caption: "ＯＫ", onClick: stop },
			]
		});
		setStatus(message);
	}

	const moveManually = (piece, cell) => {
		if( ! model.checkCanMove(piece, cell, positions)) return;
		const promo = model.checkPromotion(piece, cell, positions);
			// returns [a, b]; a: can keep raw, b: can promote
		const newPosition = { ...positions[piece.id], x: cell.x, y: cell.y, face: promo[1] ? 1 : 0,
			isOut: false };
		const captured = pieces.find(p =>
			positions[p.id].x == cell.x && positions[p.id].y == cell.y
		);
		const capturedPosition = captured ? { ...positions[captured.id], x: -1, y: -1, 
			face: 0, player: positions[piece.id].player, isOut: true, isExcluded: captured.entity.isSingleUse
		} : null;
		const move = {
			main: { piece, newPosition, oldPosition: positions[piece.id] },
			captured: captured ? {
				piece: captured, newPosition: capturedPosition, oldPosition: positions[captured.id]
			} : null,
			likeliness: 0,
		};
		if(promo[0] && promo[1]){
			setAlert({
				options: [
					{ caption: "成る", onClick: () => perform(move), isPrimary: true },
					{ caption: "成らない", onClick: () => { move.main.newPosition.face = 0, perform(move) } },
				]				
			});
		}
		else perform(move);
	}
	const perform = (move) => {
		if(move.main) setPositions[move.main.piece.id](move.main.newPosition);
		if(move.captured) setPositions[move.captured.piece.id](move.captured.newPosition);
		model.clocks[turn].stop();
		model.clocks[1 - turn].start();
		setTurn(1 - turn);
		setLastMove({
			piece: move.main.piece,
			cell: model.getCell(move.main.newPosition.x, move.main.newPosition.y),
			face: move.main.newPosition.face
		});
		setHistory(h => [...h, move]);
		setIsAfterMove(true);
	}

	const handleAiMove = (move) => { // m: move object (new)
		if(isRunning && move){
			setStatus("指しました。あなたの手番です。");
			perform(move);
		}
		else{
			setStatus("有効な手がありません。");
			resign(); // no possible move
		}
	}
	const handleAiMessage = (param) => {
		if( ! param) return;
		if(param.message) setStatus(param.message);
		else setStatus([
			//"考えています",
			//(param.counter ?? "0") + "手",
			param.move ? "(" + param.move?.name + " を検討中)..." : "",
			param.bestMove ? "候補手 : " + param.bestMove?.name + " (" + param.value + ")" : "",
		].join(" "));
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
		solver.solve(positions, turn, handleAiMove, handleAiMessage, history);
	}, [isCallingAi, isRunning]);


	return (
		<React.Fragment>
			<div className={"game" + (isRunning ? " running" : "")}>
				<SystemArea turn={turn} times={times} status={status} />
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
					move={moveManually}
					openMenu={openMenu}
				/>
			</div>
			{alert && <Modal onClose={() => setAlert(null)}>
				{alert.title && <div className="modal-title">{alert.title}</div>}
				<div className="modal-body">
					{alert.message && <div className="alert-message">{alert.message}</div>}
					{alert.options.length && <div className="buttons">
						{alert.options.map(opt => 
							opt && <button
								className={opt.isPrimary ? "primaryButton" : ""}
								onClick={() => {setAlert(null); opt.onClick()}}
								key={opt.caption}
							>{opt.caption}</button>
						)}
					</div>}
				</div>
			</Modal>}
		</React.Fragment>
	)
}
