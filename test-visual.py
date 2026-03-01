from playwright.sync_api import sync_playwright

url = 'file:///Users/ofers/Dev/ofer/github-opensource-factory/agent-arcade/test.html'
OUT = '/tmp/aa-chk'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # Typing
    page = browser.new_page(viewport={'width': 800, 'height': 300})
    page.goto(url)
    page.wait_for_timeout(300)
    page.evaluate("window.postMessage({type:'agentStatus',activity:'typing',statusText:'Writing code'}, '*')")
    page.wait_for_timeout(5000)
    page.screenshot(path=f'{OUT}-typing.png', scale='css')
    page.close()
    print('typing: done')

    # Running
    page = browser.new_page(viewport={'width': 800, 'height': 300})
    page.goto(url)
    page.wait_for_timeout(300)
    page.evaluate("window.postMessage({type:'agentStatus',activity:'running',statusText:'Running...'}, '*')")
    page.wait_for_timeout(5000)
    page.screenshot(path=f'{OUT}-running.png', scale='css')
    page.close()
    print('running: done')

    # Reading
    page = browser.new_page(viewport={'width': 800, 'height': 300})
    page.goto(url)
    page.wait_for_timeout(300)
    page.evaluate("window.postMessage({type:'agentStatus',activity:'reading',statusText:'Scanning files'}, '*')")
    page.wait_for_timeout(5000)
    page.screenshot(path=f'{OUT}-reading.png', scale='css')
    page.close()
    print('reading: done')

    # Editing
    page = browser.new_page(viewport={'width': 800, 'height': 300})
    page.goto(url)
    page.wait_for_timeout(300)
    page.evaluate("window.postMessage({type:'agentStatus',activity:'editing',statusText:'Editing files'}, '*')")
    page.wait_for_timeout(5000)
    page.screenshot(path=f'{OUT}-editing.png', scale='css')
    page.close()
    print('editing: done')

    # Searching
    page = browser.new_page(viewport={'width': 800, 'height': 300})
    page.goto(url)
    page.wait_for_timeout(300)
    page.evaluate("window.postMessage({type:'agentStatus',activity:'searching',statusText:'Looking for files'}, '*')")
    page.wait_for_timeout(5000)
    page.screenshot(path=f'{OUT}-searching.png', scale='css')
    page.close()
    print('searching: done')

    # Work then celebrate
    page = browser.new_page(viewport={'width': 800, 'height': 300})
    page.goto(url)
    page.wait_for_timeout(300)
    page.evaluate("window.postMessage({type:'agentStatus',activity:'typing',statusText:'Writing code'}, '*')")
    page.wait_for_timeout(5000)
    page.screenshot(path=f'{OUT}-work-before.png', scale='css')
    # Keep working for 10 more seconds
    page.wait_for_timeout(10000)
    page.screenshot(path=f'{OUT}-still-working.png', scale='css')
    # Now celebrate
    page.evaluate("window.postMessage({type:'agentStatus',activity:'celebrating',statusText:'Done!'}, '*')")
    page.wait_for_timeout(3000)
    page.screenshot(path=f'{OUT}-celebrate.png', scale='css')
    page.close()
    print('work->celebrate: done')

    browser.close()
    print('All done!')
