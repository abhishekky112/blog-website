document.addEventListener('DOMContentLoaded', () => {
    const blogsSection = document.querySelector('.blogs-section');

    // Fetch blogs from Firestore
    db.collection('blogs').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            const blog = doc.data();
            blog.id=doc.id;
            const blogCard = createBlogCard(blog);
            blogsSection.appendChild(blogCard);
        });
    }).catch(err => {
        console.error('Error fetching blogs:', err);
    });
});

const createBlogCard = (blog) => {
    const blogCard = document.createElement('div');
    blogCard.classList.add('blog-card');

    const blogImage = document.createElement('img');
    blogImage.src = blog.bannerImage;
    blogImage.alt = blog.title;
    blogImage.classList.add('blog-image');

    const blogTitle = document.createElement('h1');
    blogTitle.classList.add('blog-title');
    blogTitle.textContent = blog.title;

    const blogOverview = document.createElement('p');
    blogOverview.classList.add('blog-overview');
    blogOverview.innerHTML = blog.article.substring(0, 200) + '...';

    const readMoreBtn = document.createElement('a');
    readMoreBtn.href = `/${blog.id}`;
    readMoreBtn.classList.add('btn', 'dark');
    readMoreBtn.textContent = 'Read More';

    blogCard.appendChild(blogImage);
    blogCard.appendChild(blogTitle);
    blogCard.appendChild(blogOverview);
    blogCard.appendChild(readMoreBtn);

    return blogCard;
}