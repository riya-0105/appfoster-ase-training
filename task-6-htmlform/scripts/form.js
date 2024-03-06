const handlesubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    for(const[name, value] of formData.entries()) {
        console.log(`${name}:  ${value}`)
    }
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("complete_form").addEventListener("submit", handlesubmit)
})