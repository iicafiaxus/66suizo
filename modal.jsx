const Modal = function(props){
	return <div className="modal-system">
		<div className="modal-back" onClick={props.onClose}>
		</div>
		<div className="modal-main">
			{props.children}
		</div>
	</div>
};