# Alexander de Groot
# 10078797

from lxml import html
import requests
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

# gebruk lxml om data van imdb te scrapen
page = requests.get('http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series')
tree = html.fromstring(page.content)

title = tree.xpath('//href/text()')
runtime = tree.xpath('//span[@class="runtime"]/text()')
genre = tree.xpath('//span[@class="genre"]/text()')
rating = tree.xpath('//strong/text()')
stars = tree.xpath('//span[@class="stars"]/text()')

rows = zip(runtime,genre,rating)

print 'Title: ', title # lukt nog niet kan html element niet vinden
print 'Genre: ', genre
print 'Runtime: ', runtime
print 'Rating: ', rating
print 'Stars: ', stars # kan de html element niet vinden ervan

# lukt niet om data naast elkaar te zetten in csv, alleen onder elkaar
resultFile = open("output.csv", 'wb')
wr = csv.writer(resultFile, dialect='excel')
wr.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
wr.writerow(genre)#
wr.writerow(runtime)
wr.writerow([rating])

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)
