var previousLink;

function ChangeTab(link, elementToDisplay){
    if (previousLink === link) return;
    
    previousLink = link;

    // let burgerMenu = document.getElementById("burger-menu").children[0];
    // if(burgerMenu.innerText === "close"){
    //     showOrHideMenu();
    // }

    // menu links
    let linkClass = "active-link";

    let activeLink = document.getElementById("menu").getElementsByClassName(linkClass)[0];
    activeLink?.classList.remove(linkClass);
    link.classList.add(linkClass);
    //

    // content to display
    let itemClass = "item";
    let activeItemClass = "active-item";
    let flex = "flex";

    let activeItem = document.getElementById("content").getElementsByClassName(activeItemClass)[0];
    let item = document.getElementById(elementToDisplay);


    // Я ЗАКОМЕНТУВАВ ДОБАВЛЕННЯ КЛАСУ ФЛЕКС, БО ВИГЛЯДАЄ УРОДЛИВО. 


    activeItem?.classList.replace(activeItemClass, itemClass);
    //activeItem?.classList.remove(flex);

    item.classList.replace(itemClass, activeItemClass);
    //item?.classList.add(flex);
    //
}

var openedlist;
function openList(idOfMenu){
    let submenuClass = "submenu";
    let activeSubmenuClass = "active-submenu"

    let submenu = document.getElementById("menu").getElementById(idOfMenu);
    if(openedlist==submenu){
        submenu?.classList.replace(activeSubmenuClass,submenuClass );
    }
    else{
        submenu?.classList.replace(submenuClass,activeSubmenuClass );
    }
    
}

function showOrHideMenu(){
    let menu = document.getElementById("menu");

    if(menu.style.display === "" || menu.style.display === ""){
        menu.style.display = "block";
    }
    else{
        menu.style.display = "";
    }

    let icon = document.getElementById("burger-menu-icon");
    document.getElementById("burger-menu-icon").innerText = icon.innerText === "menu" ? "close" : "menu";
}

function arrowList(){
    let arrow = document.getElementById("expand");
    let hiddenList = document.getElementById("labs-list-hidden");
    let content = document.getElementById("content");

    if(arrow.innerText === "expand_less"){
        arrow.innerText = "expand_more";
        hiddenList.style.display = "none";
        hiddenList.classList.remove("open-labs-list");

        content.style.opacity = 1;
        // content.style.backgroundColor = "";
    }
    else{
        arrow.innerText = "expand_less";
        hiddenList.style.display = "";
        hiddenList.classList.add("open-labs-list");

        content.style.opacity = 0;
        // content.style.backgroundColor = "#333333";
    }
}