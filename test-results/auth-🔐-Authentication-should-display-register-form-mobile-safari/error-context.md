# Page snapshot

```yaml
- main [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "Loft Management System" [level=2] [ref=e6]
      - paragraph [ref=e7]: Create your account to get started
    - generic [ref=e9]:
      - generic [ref=e10]:
        - heading "👤 auth.signUpTitle" [level=1] [ref=e11]:
          - generic [ref=e12]: 👤
          - text: auth.signUpTitle
        - paragraph [ref=e13]: auth.signUpDescription
      - generic [ref=e14]:
        - generic [ref=e16]:
          - generic [ref=e17]:
            - generic [ref=e18]: auth.fullName
            - textbox "auth.fullName" [ref=e19]
          - generic [ref=e20]:
            - generic [ref=e21]: auth.email
            - textbox "auth.email" [ref=e22]
          - generic [ref=e23]:
            - generic [ref=e24]: auth.password
            - generic [ref=e25]:
              - textbox "auth.password" [ref=e26]
              - button [ref=e27] [cursor=pointer]:
                - img
          - button "auth.signUp" [ref=e28] [cursor=pointer]
        - paragraph [ref=e31]:
          - text: auth.haveAccount
          - link "auth.signIn" [ref=e32]:
            - /url: /login
```