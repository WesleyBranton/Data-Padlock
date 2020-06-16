const collapsible = document.getElementsByClassName('collapsible');
for (i = 0; i < collapsible.length; i++) {
    collapsible[i].getElementsByClassName('head')[0].addEventListener('click', (e) => {
        // Get parent element
        e = e.target;
        while(e.className != 'collapsible') {
            e = e.parentNode;
        }

        // Open element
        const content = e.getElementsByTagName('article')[0];
        const button = e.getElementsByClassName('head')[0].getElementsByTagName('h2')[1];
        if (content.style.maxHeight){
            content.style.maxHeight = null;
            button.textContent = '+';
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
            button.textContent = '-';
          } 
    });
}