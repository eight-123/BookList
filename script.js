/* ===== データ ===== */

let books =
  JSON.parse(localStorage.getItem("books")) || [];

let draggedBookIndex = null;
let selectedIndex = null;


/* ===== DOM ===== */

const titleInput =
  document.getElementById("titleInput");

const authorInput =
  document.getElementById("authorInput");

const genreInput =
  document.getElementById("genreInput");

const statusInput =
  document.getElementById("statusInput");

const addBtn =
  document.getElementById("addBtn");

const sortSelect =
  document.getElementById("sortSelect");


const titleFilter =
  document.getElementById("titleFilter");

const authorFilter =
  document.getElementById("authorFilter");

const genreFilter =
  document.getElementById("genreFilter");


/* ===== 保存 ===== */

function saveBooks(){

  localStorage.setItem(
    "books",
    JSON.stringify(books)
  );

}


/* ===== ジャンル色 ===== */

function genreClass(genre){

  if(genre==="SF")
    return "sf";

  if(genre==="ミステリー")
    return "mystery";

  if(genre==="歴史")
    return "history";

  if(genre==="哲学")
    return "philosophy";

  if(genre==="漫画")
    return "manga";
    
  if(genre==="ホラー")
  return "horror";

  return "other";
}


/* ===== 本追加 ===== */

function addBook(){

  const title = titleInput.value.trim();

  const author = authorInput.value.trim();

  const genre = genreInput.value;

  const status = statusInput.value;

  if(title==="") return;


  books.push({

    title:title,

    author:author,

    genre:genre,

    status:status,

    memo:"",

    createdAt:Date.now()

  });


  saveBooks();

  renderBooks();

  titleInput.value = "";

  authorInput.value = "";
}


addBtn.addEventListener(
  "click",
  addBook
);


/* ===== モーダル ===== */

function openModal(index){

  selectedIndex = index;

  const book = books[index];

  document
    .getElementById("modal")
    .classList
    .remove("hidden");


  document
    .getElementById("modalTitle")
    .textContent = book.title;


  document
    .getElementById("authorEdit")
    .value = book.author || "";


  document
    .getElementById("modalGenre")
    .textContent =
      "ジャンル: " + book.genre;


  document
    .getElementById("modalStatus")
    .textContent =
      "状態: " + book.status;


  document
    .getElementById("memoInput")
    .value = book.memo || "";
}



/* ===== 本描画 ===== */

function renderBooks(){

  const wantShelf =
    document.getElementById("wantShelf");

  const readingShelf =
    document.getElementById("readingShelf");

  const doneShelf =
    document.getElementById("doneShelf");


  wantShelf.innerHTML = "";
  readingShelf.innerHTML = "";
  doneShelf.innerHTML = "";


  const filteredBooks = books.filter(book=>{

    const titleMatch =
      book.title
        .toLowerCase()
        .includes(
          titleFilter.value
            .toLowerCase()
        );

    const authorMatch =
      (book.author || "")
        .toLowerCase()
        .includes(
          authorFilter.value
            .toLowerCase()
        );

    const genreMatch =
      genreFilter.value === "" ||
      book.genre === genreFilter.value;

    return (
      titleMatch &&
      authorMatch &&
      genreMatch
    );

  });


  filteredBooks.forEach((book)=>{

    const index =
      books.indexOf(book);

    const div =
      document.createElement("div");

    div.classList.add("book");

    div.classList.add(
      genreClass(book.genre)
    );


    div.textContent =
      book.title;


    /* 本クリック */

    div.addEventListener(
      "click",
      ()=> openModal(index)
    );


    /* ドラッグ可能 */

    div.setAttribute(
      "draggable",
      true
    );


    div.addEventListener(
      "dragstart",
      ()=>{

        draggedBookIndex = index;

        div.classList.add(
          "dragging"
        );

      }
    );


    div.addEventListener(
      "dragend",
      ()=>{

        div.classList.remove(
          "dragging"
        );

      }
    );


    /* 棚振り分け */

    if(book.status==="欲しい"){

      wantShelf.appendChild(div);

    }

    else if(
      book.status==="読んでる"
    ){

      readingShelf
        .appendChild(div);

    }

    else{

      doneShelf.appendChild(div);

    }

  });

}



/* ===== ドラッグ処理 ===== */

function setupShelfDrag(){

  const shelves = [

    {
      element:
        document.getElementById(
          "wantShelf"
        ),

      status:"欲しい"
    },

    {
      element:
        document.getElementById(
          "readingShelf"
        ),

      status:"読んでる"
    },

    {
      element:
        document.getElementById(
          "doneShelf"
        ),

      status:"読了"
    }

  ];


  shelves.forEach(shelf=>{


    shelf.element
      .addEventListener(
        "dragover",
        (e)=>{

          e.preventDefault();

          shelf.element
            .classList
            .add("hovered");

        }
      );


    shelf.element
      .addEventListener(
        "dragleave",
        ()=>{

          shelf.element
            .classList
            .remove("hovered");

        }
      );


    shelf.element
      .addEventListener(
        "drop",
        ()=>{

          shelf.element
            .classList
            .remove("hovered");


          if(
            draggedBookIndex!==null
          ){

            books[
              draggedBookIndex
            ].status =
              shelf.status;


            saveBooks();

            renderBooks();

            draggedBookIndex =
              null;
          }

        }
      );

  });

}



/* ===== 並び替え ===== */

function sortBooks(){

  const mode =
    sortSelect.value;


  if(mode==="title"){

    books.sort((a,b)=>

      a.title.localeCompare(
        b.title,
        "ja"
      )

    );

  }

  else if(mode==="genre"){

    books.sort((a,b)=>

      a.genre.localeCompare(
        b.genre,
        "ja"
      )

    );

  }

  else{

    books.sort((a,b)=>

      a.createdAt - b.createdAt

    );

  }


  saveBooks();

  renderBooks();
}


sortSelect.addEventListener(
  "change",
  sortBooks
);



/* ===== フィルタ ===== */

titleFilter.addEventListener(
  "input",
  renderBooks
);

authorFilter.addEventListener(
  "input",
  renderBooks
);

genreFilter.addEventListener(
  "change",
  renderBooks
);



/* ===== モーダル操作 ===== */

document
  .getElementById(
    "closeModal"
  )
  .addEventListener(
    "click",
    ()=>{

      document
        .getElementById(
          "modal"
        )
        .classList
        .add("hidden");

    }
  );



document
  .getElementById(
    "saveMemo"
  )
  .addEventListener(
    "click",
    ()=>{

      books[
        selectedIndex
      ].author =

        document
          .getElementById(
            "authorEdit"
          )
          .value;


      books[
        selectedIndex
      ].memo =

        document
          .getElementById(
            "memoInput"
          )
          .value;


      saveBooks();


      alert("保存しました");

    }
  );



document
  .getElementById(
    "deleteBook"
  )
  .addEventListener(
    "click",
    ()=>{

      books.splice(
        selectedIndex,
        1
      );


      saveBooks();

      renderBooks();


      document
        .getElementById(
          "modal"
        )
        .classList
        .add("hidden");

    }
  );



/* ===== 起動 ===== */

renderBooks();

setupShelfDrag();