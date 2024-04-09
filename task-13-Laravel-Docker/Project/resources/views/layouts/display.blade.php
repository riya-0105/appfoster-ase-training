<!DOCTYPE html>
    <html>
        <head lang="{{ str_replace('_', '-', app()->getLocale()) }}">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            hello {{ $data }}
        </body>
    </html>
