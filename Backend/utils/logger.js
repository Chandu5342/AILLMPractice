export function logger(req)
{
    console.log(`api called: ${req.method} ${req.url} at ${new Date().toLocaleString()}`);
}