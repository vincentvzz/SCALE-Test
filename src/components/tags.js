import React, {useEffect, useState} from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Tag from "./tag";
import "./tags.css";


// https://www.freecodecamp.org/news/how-to-add-drag-and-drop-in-react-with-react-beautiful-dnd

// Drag and drop doesn't work as expected.

function Tags(props) {

    const [loading, setLoading] = useState(false);
    const [tagNames, setTagNames] = useState([]);
    const [responseLog, setResponseLog] = useState("");
    const [errorLog, setErrorLog] = useState("");

    async function getTagName() {
        setLoading(true);
        setErrorLog("");
        fetch("https://api-test-ischool.azurewebsites.net/get")
            .then(res => {if (res.ok) { return res.json();}})
            .then(data => {
                if (data["status"] === "Success") {
                    let curTags = [];
                    let id_index = 0;
                    data["names"].forEach(function(curValue) {
                        curTags.push({
                            "name": curValue,
                            "status": "gray",
                            "id": id_index.toString()
                        });
                        id_index += 1;
                    })
                    setTagNames(curTags);
                } else {
                    setResponseLog("");
                    setErrorLog(data["error_message"]);
                }
                setLoading(false);
            }).catch(() => {
                setResponseLog("");
                setErrorLog("Something went wrong with the server.");
                setLoading(false);
            })
    }

    function handleClick(event) {
        let name = event.currentTarget.textContent;
        let curTags = tagNames;
        let curColor = "gray";
        let index = 0;
        for (let i = 0; i < curTags.length; i++) {
            if (curTags[i]["name"] === name) {
                curColor = curTags[i]["status"];
                index = i;
                break;
            }
        }
        if (curColor === "gray") {
            event.currentTarget.classList.remove('gray');
            event.currentTarget.classList.add('blue');
            curTags[index]["status"] = "blue";
        } else {
            event.currentTarget.classList.remove('blue');
            event.currentTarget.classList.add('gray');
            curTags[index]["status"] = "gray";
        }
        setTagNames(curTags);
    }

    function handleOnDragEnd(result) {
        const curTags = tagNames;
        const reorderedTag = curTags[result.source.index];
        curTags.splice(result.source.index, 1);
        curTags.splice(result.destination.index, 0, reorderedTag);
        setTagNames(curTags);
        console.log(result);
    }

    function submitTags() {

        let selectedTags = [];
        tagNames.forEach(function(curValue) {
            if (curValue["status"] === "blue") {
                selectedTags.push(curValue["name"]);
            }
        })
        if (selectedTags.length === 0) {
            setResponseLog("");
            setErrorLog("You have to select at least 1 tag.")
        } else {
            setLoading(true);
            setErrorLog("");
            fetch("https://api-test-ischool.azurewebsites.net/post", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"input": selectedTags})
            }).then(res => {if (res.ok) { return res.json();}})
            .then(data => {
                if (data["status"] === "Success") {
                    setResponseLog(data["server_message"]);
                } else {
                    setResponseLog("");
                    setErrorLog(data["error_message"]);
                }
                setLoading(false);
            }).catch(() => {
                setResponseLog("");
                setErrorLog("Something went wrong with the server.");
                setLoading(false);
            })
        }

    }

    useEffect(() => {
        getTagName();
    }, []);

    if (!loading) {
        return (
            <div className="select-tag">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="tags">
                        {(provided) => (
                            <div className="tags"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >{tagNames.map((input) => {
                                return (
                                    <Draggable key={input["name"]} draggableId={input["name"]} index={parseInt(input["id"])}>
                                        {(provided) => (
                                            <div
                                                className={input["status"] + " tag"}
                                                onClick={handleClick}
                                                ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                            >{input["name"]}
                                            </div>
                                        )}
                                    </Draggable>

                            )})}
                            {provided.placeholder}
                            </div>
                        )}

                    </Droppable>
                </DragDropContext>
                <div className="confirm-button" onClick={submitTags} style={{cursor:'pointer'}}>Confirm</div>
                <div className="response">{responseLog}</div>
                <div className="error">{errorLog}</div>
            </div>

        )
    } else {
        return (
            <div>Loading...</div>
        )
    }

}

export default Tags;