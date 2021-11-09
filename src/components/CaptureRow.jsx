export default function CaptureRow(props) {
    const getResult = () => {
        var styleColor = 'yellow';
        if (props.completed === "true")
            styleColor = 'green';// style={{ color: styleColor }}
        return (<div style={{ color: styleColor }}>{props.completed}</div>);
    }
    return (
        <tr>
            <td>
                {props.name}
            </td>
            <td>
                {props.action}
            </td>
            <td>
                {props.blocks}
            </td>
            <td>
                {props.balance}
            </td>
            <td>
                {getResult()}
            </td>
        </tr>
    );
}
