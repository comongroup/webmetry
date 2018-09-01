export default function renderIcon(icon, text) {
	return <span className="wm-icon">
		<span className="material-icons">{icon}</span>
		<span className="-wmi-text">{text}</span>
	</span>;
}
