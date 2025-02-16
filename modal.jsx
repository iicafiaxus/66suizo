const Modal = function(props){
	return <div className="modal-system">
		<div className="modal-back" onClick={props.onDismiss}>
		</div>
		<div className="modal-main">
			{props.children}
		</div>
	</div>
};