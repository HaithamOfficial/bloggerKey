const authorizedBlogIdsUrl = 'https://script.google.com/macros/s/AKfycbzO2ZkyymlyD5y5oqSaffPH4HIuCxH6GB-o7ZueULgl/dev'; // استبدل YOUR_SCRIPT_ID برابط السكريبت الصحيح

    function getBlogId() {
      const blogIdElement = document.querySelector('meta[name="blog-info"][content*="blogId"]');
      if (blogIdElement) {
        const blogIdMatch = blogIdElement.content.match(/blogId=(\d+)/);
        if (blogIdMatch) {
          console.log('Blog ID found:', blogIdMatch[1]);
          return blogIdMatch[1];
        } else {
          console.log('Blog ID format is incorrect.');
        }
      } else {
        console.log('No Blog ID meta tag found.');
      }
      return null;
    }

    async function checkAuthorization() {
      const currentBlogId = getBlogId();
      if (!currentBlogId) {
        showMessage('خطأ في تحديد المعرف', 'لا يمكن تحديد معرف المدونة. يرجى المحاولة لاحقًا.');
        return;
      }

      try {
        const response = await fetch(authorizedBlogIdsUrl);
        if (!response.ok) {
          throw new Error('فشل في تحميل قائمة المعرّفات المصرح بها');
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (Array.isArray(data.authorizedBlogIds) && data.authorizedBlogIds.includes(currentBlogId)) {
          console.log('معرف المدونة مصرح به. تحميل القالب...');
        } else {
          showMessage('القالب غير مصرح به', 'هذا القالب غير مصرح باستخدامه في هذه المدونة. سيتم توجيهك قريباً...', true);
          setTimeout(() => {
            window.location.href = 'https://example.com/unauthorized'; // استبدل بالرابط المطلوب
          }, 5000);
        }
      } catch (error) {
        console.error('خطأ:', error);
        showMessage('خطأ عند التحقق', 'حدث خطأ عند التحقق من صلاحية القالب. يرجى المحاولة لاحقًا.', true);
      }
    }

    function showMessage(title, message, retry = false) {
      document.body.innerHTML = `
        <div class="unauthorized-message">
          <div>
            <h1>${title}</h1>
            <p>${message}</p>
            <p><a href="mailto:developer@example.com">developer@example.com</a></p>
            ${retry ? '<button onclick="location.reload()">إعادة المحاولة</button>' : ''}
          </div>
        </div>`;
    }

    window.onload = checkAuthorization;
1
