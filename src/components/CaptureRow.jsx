export default function CaptureRow(props) {
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
                {props.completed}
            </td>
        </tr>
    );
}
