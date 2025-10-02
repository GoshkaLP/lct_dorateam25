from api.routes import itp, itp_fitlers, lines, mkd

routers = [
    itp.router,
    itp_fitlers.router,
    mkd.router,
    lines.router,
]
