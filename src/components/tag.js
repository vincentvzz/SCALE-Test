import React, {useState} from "react";

function Tag(props) {
    const [select, setSelect] = useState("gray");

    function handleClick() {
        if (select === "gray") {
            setSelect("blue");
        } else {
            setSelect("gray");
        }
    }


    return (
        <div className={select + " tag"} style={{cursor:'pointer'}}>{props.name}</div>
    )
}

export default Tag;