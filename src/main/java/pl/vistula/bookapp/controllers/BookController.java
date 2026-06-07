package pl.vistula.bookapp.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import pl.vistula.bookapp.jpa.model.Book;
import pl.vistula.bookapp.jpa.repository.BookRepository;
import pl.vistula.bookapp.jpa.repository.BookReviewRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@Slf4j
@RequestMapping("/book")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookReviewRepository bookReviewRepository;

    @GetMapping("/")
    List<Book> list(
        @RequestParam(required = false) Long authorId,
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) String name
    ) {

        if (authorId != null 
            || categoryId != null
            || name != null && !name.trim().isEmpty()) {

            Specification<Book> spec = Specification.unrestricted();

            if (name != null) {
                spec = spec.and((root, query, cb) -> 
                    cb.like(
                        cb.lower(root.get("name")), 
                        "%" + name.toLowerCase() + "%"
                    )
                );
            }

            if (authorId != null) {
                spec = spec.and((root, query, cb) -> 
                    cb.equal(root.join("authors").get("id"), authorId));
            }

            if (categoryId != null) {
                spec = spec.and((root, query, cb) -> 
                    cb.equal(root.join("categories").get("id"), categoryId));
            }    
            return bookRepository.findAll(spec);        
        } else {
            log.info("Getting list of books");
            return bookRepository.findAll();
        }
    }

    @PostMapping("/save")
    public Book save(@RequestBody Book book) {
        log.info("Saving book: {}", book);
      
        return bookRepository.save(book);
    }

    @GetMapping("/{id}")
    ResponseEntity<Book> get(@PathVariable Long id) {
        log.info("Getting book with id: {}", id);
        return bookRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    void delete(@PathVariable Long id) {
        log.info("Deleting book with id: {}", id);
        bookReviewRepository.deleteByBookId(id);
        bookRepository.deleteById(id);
    }


    @PostMapping("/{id}/cover")
    public ResponseEntity<Void> setCover(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        log.info("adding book cover: {}", id);
      
        byte[] cover = file.getBytes();

        return bookRepository.findById(id)
            .map(book -> {
                book.setCover(cover);
                bookRepository.save(book);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().<Void>build());
    }

    @GetMapping(value = "/{id}/cover", produces = MediaType.IMAGE_PNG_VALUE)
   public ResponseEntity<byte[]> getCover(@PathVariable Long id) {
        log.info("get book cover: {}", id);
      
        return bookRepository.findById(id)
            .map(Book::getCover)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/cover")
    public ResponseEntity<Void> clearCover(@PathVariable Long id) {
        log.info("deleting book cover: {}", id);
      
        return bookRepository.findById(id)
            .map(book -> {
                book.setCover(null);
                bookRepository.save(book);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().<Void>build());
    }

  }
