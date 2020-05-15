# Ionic React Discoveries
What is Ionic?
Web Component library (and name of the company), collection of prebuilt web components that adjust to the underlying platform and are highly customizable 
Works best with Capacitor (allows any web app into cross platform app (ios,natiive apps) 

- Ionic only will build great lookuing web apps quickly with pre-dfefined components and styles
- Capacitor only builds native mobile apps w/o mobile deb knowledge (done by converting standalone web apps and wrapping them to get mobile app, helps ship your web app as a mobile app as well) => (Wraps your web app into a real native mobile app)
  -> hosts your web app and hosts it in a WebView => slightly worse performance than real native apps )nut 99% of all Apps will  not feel it 

## Alternatives to Ionic (w/ capacitor)
-Learning java/Objective C/ Swift for android and iOS (too much work and not useful later and can’t reuse it)
- React Native (does not use wrapped web app approach, react only , no native HTML or CSS usage)
- Flutter (compiled code, uses Dart, write code once and you get it in Native Apps and a lot of built in apps) 


# Git Issues if you use template starter app 'my-first-app'
- For some reason, when you try to commit with the my-first-app ionic template (the photo generator app), you cannot save your code changes into your own git repo. You hit an error saying  ```Fatal: HttpRequestException encountered.
remote: Permission to ionic-team/photo-gallery-capacitor-react.git denied to meshellun```
I created this new project as a template instead. My previous project using the starter template can be found here 
https://evening-coast-36349.herokuapp.com/tab1
