# Backend

Default backend is Handlebars templating system.
However there is already an abstraction layer for creating other backend even no other is implemented right now.
If you're interested in writing support for different temple engine you can open issue and submit pull request with
implementation of your favorite one.

There might be different output formats support besides HTML in the future.
However this will probably require deeper changes in compilation process since content is now compiled to HTML
in frontend module. It will be nice to have better solution in future. Anyway this approach made it easy to
reuse backend from Marked compiler which made whole intitial implementation much easier.
