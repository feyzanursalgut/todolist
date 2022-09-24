import React, { useState, useEffect } from 'react'
import Header from './Header'
import ListBox from './ListBox'

function Section() {

  const [toDoList, setToDoList] = useState([]);
  const [status, setStatus] = useState("");
  const [noteList, setNoteList] = useState([]);


  /* LocalStorage tan verileri çekme işlemi */
  useEffect(() => {
    const getLocalNotes = JSON.parse(localStorage.getItem("notes"))
    setToDoList(getLocalNotes)
    if (getLocalNotes === null) {
      setToDoList([])
    } else {
      setToDoList(getLocalNotes)
    }

  }, []);

  /* Seçilen duruma göre ekranda gösterilecek notları güncelleme işlemi */
  useEffect(() => {
    switch (status) {
      case "All":
        setNoteList(toDoList);
        break;

      case "Active":
        let activeNote = toDoList.filter((note) => note.isChecked === false)
        setNoteList(activeNote);
        break;

      case "Completed":
        let completeNote = toDoList.filter((note) => note.isChecked === true)
        setNoteList(completeNote);
        break;
      default:
        setNoteList(toDoList);
        break;
    }

  }, [toDoList, status]);

  /* Not listesine yeni not ekleme işlemi */
  function handleSubmit(value) {

    setToDoList(prevNote => {
      return [
        ...prevNote,
        value
      ]
    })
    localStorage.setItem("notes", JSON.stringify([...toDoList, value]))
  }

  /* Not silme işlemi */
  function deleteNote(delNoteId) {

    let newList = toDoList.filter((prevNote) => prevNote.id !== delNoteId)

    setToDoList(newList)
    localStorage.setItem("notes", JSON.stringify(newList))
  }


  /* Tamamlanmış notların hepsini silme işlemi */
  function ClearCompleted() {

    let newToDoList = toDoList.filter(note => note.isChecked === false)

    setToDoList(newToDoList)
    localStorage.setItem("notes", JSON.stringify(newToDoList))
  }

  /* Tüm notları tamamlandı olarak seçme işlemi */
  function allChecked() {

    let statusChecked = toDoList.map(prevNotes => {
      let status;
      if (prevNotes.isChecked === false) {
        status = true
      }
      return status
    })

    let newNotes = toDoList.map(prevNotes => {
      if (prevNotes.isChecked === false) {
        prevNotes.isChecked = !prevNotes.isChecked
      }

      return prevNotes

    })

    if (statusChecked.includes(true)) {

      setToDoList(newNotes)
      localStorage.setItem("notes", JSON.stringify(newNotes))

    }
    else {
      let statusChange = newNotes.map(note => {

        if (note.isChecked) {

          note.isChecked = !note.isChecked

        }
        return note
      })

      setNoteList(statusChange)
      localStorage.setItem("notes", JSON.stringify(statusChange))
    }
  }

  return (
    <section className="todoapp">
      <Header
        handleSubmit={handleSubmit}
      />

      <section className="main">
        <input className="toggle-all" type="checkbox" checked={toDoList.find(note => note.isChecked === true) ? true : false} onChange={allChecked} />

        {

          toDoList.length <= 0 ? null : <label htmlFor="toggle-all" onClick={allChecked}>
            Mark all as complete
          </label>

        }


        <ul className="todo-list">

          {

            noteList.map((note) => {

              return <ListBox
                key={note.id}
                note={note}
                setToDoList={setNoteList}
                toDoList={toDoList}
                deleteNote={deleteNote}
              />
            })
          }

        </ul>
      </section>

      <footer className="footer">
        <span className="todo-count">
          <strong>{toDoList.filter((note) => note.isChecked === false).length} </strong>
          items left
        </span>

        <ul className="filters">
          <li>
            <a href="#/" id='All' onClick={() => setStatus("All")} className={status === "All" ? "selected" : ""}>All</a>
          </li>
          <li>
            <a href="#/" id='Active' onClick={() => setStatus("Active")} className={status === "Active" ? "selected" : ""}>Active</a>
          </li>
          <li>
            <a href="#/" id='Completed' onClick={() => setStatus("Completed")} className={status === "Completed" ? "selected" : ""}>Completed</a>
          </li>
        </ul>

        {/* Listede tamamlanmış not varsa Clear completed butonu gösterilir.Eğer hi. tamamlanmış not yoksa gösterilmez. */}
        {
          toDoList.find(todo => todo.isChecked === true) && <button onClick={ClearCompleted} className="clear-completed">
            Clear completed
          </button>
        }
      </footer>
    </section>
  )
}

export default Section