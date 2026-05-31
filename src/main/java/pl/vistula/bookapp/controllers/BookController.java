package pl.vistula.bookapp.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import pl.vistula.bookapp.jpa.model.Book;
import pl.vistula.bookapp.jpa.repository.BookRepository;

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

    @GetMapping("/")
    List<Book> list(@RequestParam(required = false) Long authorId) {
        if (authorId == null) {
            log.info("Getting list of books");
            return bookRepository.findAll();
        } else {
            log.info("Getting list of books for author with id: {}", authorId);
            return bookRepository.findByAuthorsId(authorId);
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
        bookRepository.deleteById(id);
    }

  }
